
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, Student } from '../types';
import { Header, Sidebar } from './Layout';
import ViewFeedback from './ViewFeedback';

// Placeholder for a Dashboard Overview
const StudentOverview: React.FC<{ studentId: string }> = ({ studentId }) => (
    <div>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Student Dashboard</h2>
        <p>Welcome! Here you can view your enrolled courses and feedback.</p>
        {/* In a real app, this would show enrolled courses, etc. */}
    </div>
);


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
