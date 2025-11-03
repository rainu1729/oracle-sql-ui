import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as API from '../services/api';
import { User, UserRole, Admin, Teacher, Student, Course } from '../types';
import { Header, Sidebar } from './Layout';
import { Card } from './UI';
import { PencilIcon, TrashIcon, UsersIcon, BookOpenIcon } from './Icons';

// Admin Overview Component
const AdminOverview: React.FC = () => {
    const [stats, setStats] = useState([
        { label: "Total Students", value: 0, icon: UsersIcon },
        { label: "Total Teachers", value: 0, icon: UsersIcon },
        { label: "Total Courses", value: 0, icon: BookOpenIcon },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            const [students, teachers, courses] = await Promise.all([
                API.getStudents(),
                API.getTeachers(),
                API.getCourses()
            ]);
            
            setStats([
                { label: "Total Students", value: students.length, icon: UsersIcon },
                { label: "Total Teachers", value: teachers.length, icon: UsersIcon },
                { label: "Total Courses", value: courses.length, icon: BookOpenIcon },
            ]);
        };
        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Overview</h2>
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

// A component to manage Teachers
const ManageTeachers: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({
        name: '',
        email: '',
        specialization: ''
    });
    
    useEffect(() => {
        const fetchTeachers = async () => {
            setIsLoading(true);
            const teacherData = await API.getTeachers();
            setTeachers(teacherData);
            setIsLoading(false);
        };
        fetchTeachers();
    }, []);

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Ensure payload includes required fields from the Teacher type
            const payload = {
                name: newTeacher.name,
                email: newTeacher.email,
                specialization: newTeacher.specialization,
                role: UserRole.TEACHER,
                courseIds: [] as string[],
            };

            const addedTeacher = await API.addTeacher(payload as any);
            setTeachers([...teachers, addedTeacher]);
            setShowAddModal(false);
            setNewTeacher({ name: '', email: '', specialization: '' });
        } catch (error) {
            // Log more details when available
            console.error('Failed to add teacher:', error);
            // If the error contains a response body, attempt to read it (helps debugging 422 payload issues)
            try {
                // @ts-ignore - some errors may carry a `response` with `json()`
                const resp = error?.response;
                if (resp && typeof resp.json === 'function') {
                    const body = await resp.json();
                    console.error('Server response body:', body);
                }
            } catch (e) {
                // ignore
            }
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Teachers</h3>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Add Teacher
                </button>
            </div>
            
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

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h4 className="text-lg font-semibold mb-4">Add New Teacher</h4>
                        <form onSubmit={handleAddTeacher}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={newTeacher.name}
                                        onChange={e => setNewTeacher({...newTeacher, name: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={newTeacher.email}
                                        onChange={e => setNewTeacher({...newTeacher, email: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Specialization</label>
                                    <input
                                        type="text"
                                        value={newTeacher.specialization}
                                        onChange={e => setNewTeacher({...newTeacher, specialization: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                                    >
                                        Add Teacher
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
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
                return <AdminOverview />
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