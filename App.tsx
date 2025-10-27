
import React from 'react';
// FIX: Corrected import paths to be relative.
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserRole } from './types';

import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';

const AppContent: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <LoginPage />;
    }

    switch (user.role) {
        case UserRole.ADMIN:
            return <AdminDashboard />;
        case UserRole.TEACHER:
            return <TeacherDashboard />;
        case UserRole.STUDENT:
            return <StudentDashboard />;
        default:
            // This case handles potential unknown roles and defaults to logging out.
            return <LoginPage />;
    }
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
