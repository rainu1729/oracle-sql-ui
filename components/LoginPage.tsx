
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Card, Input } from './UI';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);
        try {
            const success = await login(email, password);
            if (success) {
                // Navigate based on user role
                const userRole = JSON.parse(sessionStorage.getItem('authUser') || '{}').role;
                switch (userRole?.toLowerCase()) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'teacher':
                        navigate('/teacher');
                        break;
                    case 'student':
                        navigate('/student');
                        break;
                    default:
                        setError('Invalid user role');
                }
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">SQL Academy</h1>
                    <p className="mt-2 text-gray-600">Please sign in to your account</p>
                </div>
                 <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="E.g., student@test.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                            />
                        </div>
                        <div>
                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>
                </Card>
                 <div className="text-center text-sm text-gray-500">
                    <p>Test credentials:</p>
                    <ul className="list-disc list-inside">
                        <li><b>Admin:</b> admin@test.com</li>
                        <li><b>Teacher:</b> teacher@test.com</li>
                        <li><b>Student:</b> student@test.com</li>
                    </ul>
                    <p className="mt-2">Password for all is: <b>password</b></p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
