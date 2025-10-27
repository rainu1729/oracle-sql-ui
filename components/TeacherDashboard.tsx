
import React, { useState, useEffect } from 'react';
// FIX: Corrected import paths to be relative.
import { useAuth } from '../contexts/AuthContext';
import * as API from '../services/api';
import { Course, Enrollment, EnrollmentStatus, Feedback, Student, Teacher, UserRole } from '../types';
import { Header, Sidebar } from './Layout';
import { Card, Button, Modal, Select, Textarea } from './UI';
import { BookOpenIcon, UsersIcon, PlusIcon, PencilIcon } from './Icons';

const TeacherOverview: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const [stats, setStats] = useState([
        { label: "Total Courses", value: 0, icon: BookOpenIcon },
        { label: "Total Students", value: 0, icon: UsersIcon },
        { label: "Pending Enrollments", value: 0, icon: UsersIcon },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            const courses = await API.getCoursesForTeacher(teacherId);
            const enrollments = await API.getEnrollmentsForTeacher(teacherId);
            
            const students = await API.getStudents();
            const teacherCourseIds = new Set(courses.map(c => c.id));
            const uniqueStudents = new Set(students.filter(s => s.enrolledCourseIds.some(cid => teacherCourseIds.has(cid))).map(s => s.id));

            setStats([
                { label: "Total Courses", value: courses.length, icon: BookOpenIcon },
                { label: "Total Students", value: uniqueStudents.size, icon: UsersIcon },
                { label: "Pending Enrollments", value: enrollments.filter(e => e.status === 'pending').length, icon: UsersIcon },
            ]);
        };
        fetchData();
    }, [teacherId]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Teacher Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map(stat => (
                    <Card key={stat.label} className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                            <stat.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-gray-500">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const ManageEnrollments: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    type EnrollmentWithDetails = Enrollment & { studentName: string; courseName: string };
    const [enrollments, setEnrollments] = useState<EnrollmentWithDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEnrollments = async () => {
        setIsLoading(true);
        const result = await API.getEnrollmentsForTeacher(teacherId);
        setEnrollments(result);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchEnrollments();
    }, [teacherId]);

    const handleStatusChange = async (enrollmentId: string, status: EnrollmentStatus) => {
        await API.updateEnrollmentStatus(enrollmentId, status);
        fetchEnrollments(); 
    };
    
    const pendingEnrollments = enrollments.filter(e => e.status === 'pending');

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Enrollments</h2>
            <Card>
                <h3 className="text-lg font-semibold mb-4">Pending Requests</h3>
                {isLoading ? <p>Loading...</p> : pendingEnrollments.length > 0 ? (
                    <ul className="space-y-4">
                        {pendingEnrollments.map(enr => (
                            <li key={enr.id} className="flex flex-wrap items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{enr.studentName}</p>
                                    <p className="text-sm text-gray-600">{enr.courseName} - Requested on {enr.requestDate}</p>
                                </div>
                                <div className="flex gap-2 mt-2 sm:mt-0">
                                    <Button className="!bg-green-600 hover:!bg-green-700 !px-3 !py-1" onClick={() => handleStatusChange(enr.id, 'approved')}>Approve</Button>
                                    <Button className="!bg-red-600 hover:!bg-red-700 !px-3 !py-1" onClick={() => handleStatusChange(enr.id, 'rejected')}>Reject</Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : <p>No pending enrollment requests.</p>}
            </Card>
        </div>
    );
}

const ManageCourses: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            const result = await API.getCoursesForTeacher(teacherId);
            setCourses(result);
            setIsLoading(false);
        };
        fetchCourses();
    }, [teacherId]);

    return (
         <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Courses</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <Card key={course.id}>
                            <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{course.duration} &bull; Capacity: {course.capacity}</p>
                            <p className="text-gray-700">{course.description}</p>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

const ManageFeedback: React.FC<{ teacherId: string }> = ({ teacherId }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [studentsByCourse, setStudentsByCourse] = useState<Record<string, Student[]>>({});
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
    const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
    const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);

    const [comment, setComment] = useState('');
    const [grade, setGrade] = useState<'A' | 'B' | 'C' | 'D' | 'F'>('A');

    const fetchData = async () => {
        setIsLoading(true);
        const teacherCourses = await API.getCoursesForTeacher(teacherId);
        setCourses(teacherCourses);
        const allFeedback = await API.getFeedbackForTeacher(teacherId);
        setFeedback(allFeedback);

        const studentsMap: Record<string, Student[]> = {};
        for (const course of teacherCourses) {
            const enrolledStudents = await API.getEnrolledStudentsForCourse(course.id);
            studentsMap[course.id] = enrolledStudents;
        }
        setStudentsByCourse(studentsMap);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [teacherId]);

    const openFeedbackModal = (student: Student, course: Course) => {
        const existingFeedback = feedback.find(f => f.studentId === student.id && f.courseId === course.id);
        setCurrentStudent(student);
        setCurrentCourse(course);
        if (existingFeedback) {
            setCurrentFeedback(existingFeedback);
            setComment(existingFeedback.comment);
            setGrade(existingFeedback.grade);
        } else {
            setCurrentFeedback(null);
            setComment('');
            setGrade('A');
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentStudent || !currentCourse) return;

        if (currentFeedback) { // Update existing feedback
            await API.updateFeedback(currentFeedback.id, { comment, grade });
        } else { // Add new feedback
            await API.createFeedback(
                currentStudent.id,
                currentCourse.id,
                teacherId,
                grade,
                comment
            );
        }
        setIsModalOpen(false);
        fetchData(); // Refresh data
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Student Feedback</h2>
            {isLoading ? <p>Loading...</p> : (
                <div className="space-y-6">
                    {courses.map(course => (
                        <Card key={course.id}>
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">{course.name}</h3>
                            {studentsByCourse[course.id]?.length > 0 ? (
                                <ul className="space-y-3">
                                    {studentsByCourse[course.id].map(student => {
                                        const studentFeedback = feedback.find(f => f.studentId === student.id && f.courseId === course.id);
                                        return (
                                            <li key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                                <div>
                                                    <p className="font-medium">{student.name}</p>
                                                    {studentFeedback && <p className="text-xs text-gray-500">Grade: {studentFeedback.grade} &bull; Last Updated: {studentFeedback.date}</p>}
                                                </div>
                                                <Button
                                                    className={`!px-3 !py-1 ${studentFeedback ? '!bg-gray-500 hover:!bg-gray-600' : ''}`}
                                                    onClick={() => openFeedbackModal(student, course)}
                                                >
                                                    {studentFeedback ? <PencilIcon className="w-4 h-4 mr-1" /> : <PlusIcon className="w-4 h-4 mr-1" />}
                                                    {studentFeedback ? 'Edit Feedback' : 'Add Feedback'}
                                                </Button>
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : <p className="text-gray-500">No students are enrolled in this course yet.</p>}
                        </Card>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Feedback for ${currentStudent?.name} in ${currentCourse?.name}`}>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Grade</label>
                        <Select value={grade} onChange={(e) => setGrade(e.target.value as any)}>
                            {['A', 'B', 'C', 'D', 'F'].map(g => <option key={g} value={g}>{g}</option>)}
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <Textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" className="!bg-gray-200 hover:!bg-gray-300 !text-gray-800" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{currentFeedback ? 'Update Feedback' : 'Submit Feedback'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};


const TeacherDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { user } = useAuth();

    if (!user || user.role !== UserRole.TEACHER) return null;

    const renderContent = () => {
        switch (activeView) {
            case 'enrollments': return <ManageEnrollments teacherId={user.id} />;
            case 'courses': return <ManageCourses teacherId={user.id} />;
            case 'feedback': return <ManageFeedback teacherId={user.id} />;
            default: return <TeacherOverview teacherId={user.id} />;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar role={user.role} activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col bg-gray-100">
                <Header user={user as Teacher} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default TeacherDashboard;
