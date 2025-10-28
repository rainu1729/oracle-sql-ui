
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Student, Course } from '../types';
import { Header, Sidebar } from './Layout';
import ViewFeedback from './ViewFeedback';
import { getCourses, enrollInCourse } from '../services/api';

const CourseCard: React.FC<{ 
    course: Course;
    showEnroll?: boolean;
    onEnroll?: (courseId: string) => Promise<void>;
}> = ({ course, showEnroll, onEnroll }) => {
    const [enrolling, setEnrolling] = useState(false);

    const handleEnroll = async () => {
        if (onEnroll) {
            setEnrolling(true);
            try {
                await onEnroll(course.id);
            } catch (error) {
                console.error('Error enrolling in course:', error);
            } finally {
                setEnrolling(false);
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
            <div className="mt-2 text-sm text-gray-500">
                <p>Duration: {course.duration}</p>
                <p>Start Date: {new Date(course.startDate).toLocaleDateString()}</p>
                <p>End Date: {new Date(course.endDate).toLocaleDateString()}</p>
            </div>
            {showEnroll && (
                <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className={`mt-4 px-4 py-2 rounded-md text-white ${
                        enrolling 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
            )}
        </div>
    );
};

// Dashboard Overview with enrolled and available courses
const StudentOverview: React.FC<{ studentId: string }> = ({ studentId }) => {
    const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const allCourses = await getCourses();
                const student = JSON.parse(sessionStorage.getItem('authUser') || '{}') as Student;
                
                // Filter courses into enrolled and available
                const enrolled = allCourses.filter(course => 
                    student.enrolledCourseIds.includes(course.id)
                );
                const available = allCourses.filter(course => 
                    !student.enrolledCourseIds.includes(course.id)
                );

                setEnrolledCourses(enrolled);
                setAvailableCourses(available);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [studentId]);

    if (loading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Dashboard</h2>
            
            {/* Enrolled Courses Section */}
            <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Enrolled Courses</h3>
                <div className="space-y-4">
                    {enrolledCourses.length > 0 ? (
                        enrolledCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <p className="text-gray-600">You are not enrolled in any courses yet.</p>
                    )}
                </div>
            </section>

            {/* Available Courses Section */}
            <section>
                <h3 className="text-xl font-semibold mb-4 text-gray-700">Available Courses</h3>
                <div className="space-y-4">
                    {availableCourses.length > 0 ? (
                        availableCourses.map(course => (
                            <CourseCard 
                                key={course.id} 
                                course={course}
                                showEnroll={true}
                                onEnroll={async (courseId) => {
                                    try {
                                        await enrollInCourse(studentId, courseId);
                                        // Refresh the course lists after successful enrollment
                                        const allCourses = await getCourses();
                                        const student = JSON.parse(sessionStorage.getItem('authUser') || '{}') as Student;
                                        student.enrolledCourseIds.push(courseId);
                                        sessionStorage.setItem('authUser', JSON.stringify(student));
                                        
                                        // Update the course lists
                                        setEnrolledCourses(allCourses.filter(c => 
                                            student.enrolledCourseIds.includes(c.id)
                                        ));
                                        setAvailableCourses(allCourses.filter(c => 
                                            !student.enrolledCourseIds.includes(c.id)
                                        ));
                                    } catch (error) {
                                        console.error('Error enrolling in course:', error);
                                        alert('Failed to enroll in the course. Please try again.');
                                    }
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-gray-600">No courses available for enrollment at this time.</p>
                    )}
                </div>
            </section>
        </div>
    );
};


const StudentDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { user } = useAuth();

    if (!user || user.role !== UserRole.STUDENT) return null;

    const renderContent = () => {
        switch (activeView) {
            case 'feedback':
                return <ViewFeedback studentId={user.id} />;
            case 'dashboard':
            default:
                return <StudentOverview studentId={user.id} />;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar role={user.role} activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col bg-gray-100">
                <Header user={user as Student} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default StudentDashboard;
