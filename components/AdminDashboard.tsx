import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as API from '../services/api';
import { User, UserRole, Admin, Teacher, Student, Course } from '../types';
import { Header, Sidebar } from './Layout';
import { Card } from './UI';
import { PencilIcon, TrashIcon } from './Icons';

// A component to manage Teachers
const ManageTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchTeachers = async () => {
            setIsLoading(true);
            const teacherData = await API.getTeachers();
            setTeachers(teacherData);
            setIsLoading(false);
        };
        fetchTeachers();
    }, []);

    return (
        <Card>
            <h3 className="text-lg font-semibold mb-4">Manage Teachers</h3>
            {isLoading ? <p>Loading...</p> : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.map(teacher => (
                                <tr key={teacher.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.specialization}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4"><PencilIcon /></button>
                                        <button className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

// A component to manage Students
const ManageStudents: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            const studentData = await API.getStudents();
            setStudents(studentData);
            setIsLoading(false);
        };
        fetchStudents();
    }, []);

    return (
        <Card>
            <h3 className="text-lg font-semibold mb-4">Manage Students</h3>
            {isLoading ? <p>Loading...</p> : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {students.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.joinDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4"><PencilIcon /></button>
                                        <button className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

// A component to manage Classes
const ManageClasses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            const courseData = await API.getCourses();
            setCourses(courseData);
            setIsLoading(false);
        };
        fetchCourses();
    }, []);

    return (
        <Card>
            <h3 className="text-lg font-semibold mb-4">Manage Classes</h3>
            {isLoading ? <p>Loading...</p> : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.startDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.endDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900 mr-4"><PencilIcon /></button>
                                        <button className="text-red-600 hover:text-red-900"><TrashIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};


// Main dashboard component
const AdminDashboard: React.FC = () => {
    const [activeView, setActiveView] = useState('dashboard');
    const { user } = useAuth();

    if (!user || user.role !== UserRole.ADMIN) return null;

    const renderContent = () => {
        switch (activeView) {
            case 'teachers':
                 return <ManageTeachers />;
            case 'students':
                 return <ManageStudents />;
            case 'classes':
                 return <ManageClasses />;
            case 'dashboard':
            default:
                return (<div><h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Overview</h2><p>Welcome to the admin dashboard. Select an option from the sidebar to manage the academy.</p></div>)
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar role={user.role} activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col bg-gray-100">
                <Header user={user as Admin} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;