

import React from 'react';
// FIX: Corrected import paths to be relative.
import { useAuth } from '../contexts/AuthContext';
import { UserRole, type AppUser } from '../types';
import { UsersIcon, BookOpenIcon, PresentationChartBarIcon, LogoutIcon, DashboardIcon, ChatAlt2Icon, CheckCircleIcon } from './Icons';

export const Header: React.FC<{ user: AppUser }> = ({ user }) => {
    const { logout } = useAuth();
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Welcome, {user.name}!</h1>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
                <LogoutIcon />
                Logout
            </button>
        </header>
    );
};

export const Sidebar: React.FC<{ role: UserRole; activeView: string; setActiveView: (view: string) => void }> = ({ role, activeView, setActiveView }) => {
    const navItems = {
        [UserRole.ADMIN]: [
            { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
            { id: 'teachers', label: 'Manage Teachers', icon: UsersIcon },
            { id: 'students', label: 'Manage Students', icon: UsersIcon },
            { id: 'classes', label: 'Manage Classes', icon: PresentationChartBarIcon },
        ],
        [UserRole.TEACHER]: [
            { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
            { id: 'enrollments', label: 'Manage Enrollments', icon: CheckCircleIcon },
            { id: 'courses', label: 'Manage Courses', icon: BookOpenIcon },
            { id: 'feedback', label: 'Manage Feedback', icon: ChatAlt2Icon },
        ],
        [UserRole.STUDENT]: [
            { id: 'dashboard', label: 'Dashboard', icon: BookOpenIcon },
            { id: 'feedback', label: 'View Feedback', icon: ChatAlt2Icon },
        ],
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-gray-700">
                SQL Academy
            </div>
            <nav className="flex-1 p-4">
                <ul>
                    {navItems[role].map(item => (
                        <li key={item.id}>
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${activeView === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
