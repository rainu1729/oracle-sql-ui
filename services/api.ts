
import {
    User,
    UserRole,
    Teacher,
    Student,
    Course,
    Enrollment,
    EnrollmentStatus,
    Feedback,
    EnrollmentWithDetails
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000';

interface LoginResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Helper function to make authenticated API calls
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    const token = sessionStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
};

// Authentication
export const login = async (
    email: string,
    password: string
): Promise<User | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: email,
                password: password 
            }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data: LoginResponse = await response.json();
        
        // Store both token and user data
        sessionStorage.setItem('token', data.access_token);
        sessionStorage.setItem('authUser', JSON.stringify(data.user));
        
        return data.user;
    } catch (error) {
        console.error('Login error:', error);
        return null;
    }
};

// User Management
export const getTeachers = async (): Promise<Teacher[]> => {
    return apiCall<Teacher[]>('/api/teachers');
};

export const getStudents = async (): Promise<Student[]> => {
    return apiCall<Student[]>('/api/students');
};

// Course Management
export const getCourses = async (): Promise<Course[]> => {
    return apiCall<Course[]>('/api/courses');
};

export const getCoursesForTeacher = async (teacherId: string): Promise<Course[]> => {
    return apiCall<Course[]>(`/api/teachers/${teacherId}/courses`);
};

// Enrollment Management
export const getEnrollmentsForTeacher = async (teacherId: string): Promise<EnrollmentWithDetails[]> => {
    return apiCall<EnrollmentWithDetails[]>(`/api/teachers/${teacherId}/enrollments`);
};

export const getEnrolledStudentsForCourse = async (courseId:string) : Promise<Student[]> => {
    return apiCall<Student[]>(`/api/courses/${courseId}/students`)
}

export const updateEnrollmentStatus = async (
    enrollmentId: string, 
    status: EnrollmentStatus
): Promise<EnrollmentWithDetails> => {
    return apiCall<EnrollmentWithDetails>(`/api/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
    });
};

// Feedback Management
export const getFeedbackForTeacher = async (teacherId: string): Promise<Feedback[]> => {
    return apiCall<Feedback[]>(`/api/teachers/${teacherId}/feedback`);
};

export const getEnrolledStudents = async (courseId: string): Promise<Student[]> => {
    return apiCall<Student[]>(`/api/courses/${courseId}/students`);
};

export const getFeedback = async (feedbackId: string): Promise<Feedback | null> => {
    return apiCall<Feedback>(`/api/feedback/${feedbackId}`);
};

export const createFeedback = async (
    studentId: string,
    courseId: string,
    teacherId: string,
    grade: string,
    comment: string
): Promise<Feedback> => {
    return apiCall<Feedback>('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
            studentId,
            courseId,
            teacherId,
            grade,
            comment
        })
    });
};

export const getFeedbackForStudent = async (studentId: string): Promise<Feedback[]> => {
    return apiCall<Feedback[]>(`/api/students/${studentId}/feedback`);
};

// Enrollment Management
export const enrollInCourse = async (studentId: string, courseId: string): Promise<Enrollment> => {
    return apiCall<Enrollment>('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify({
            studentId,
            courseId,
            status: 'pending'
        })
    });
};

// Additional Feedback Management
export const updateFeedback = async (
    feedbackId: string, 
    data: { comment: string; grade: 'A' | 'B' | 'C' | 'D' | 'F' }
): Promise<Feedback | null> => {
    return apiCall<Feedback>(`/api/feedback/${feedbackId}/update`, {
        method: 'POST',
        headers: {
                'Content-Type': 'application/json',
            },
        body: JSON.stringify(data)
    });
};
