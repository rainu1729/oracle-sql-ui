export enum UserRole {
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student',
}

export interface AppUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface Admin extends AppUser {
    role: UserRole.ADMIN;
}

export interface Teacher extends AppUser {
    role: UserRole.TEACHER;
    courseIds: string[];
    specialization: string;
}

export interface Student extends AppUser {
    role: UserRole.STUDENT;
    enrolledCourseIds: string[];
    joinDate: string;
}

export type User = Admin | Teacher | Student;

export interface Course {
    id: string;
    name: string;
    description: string;
    teacherId: string;
    capacity: number;
    duration: string;
    startDate: string;
    endDate: string;
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected';

export interface Enrollment {
    id: string;
    studentId: string;
    courseId: string;
    status: EnrollmentStatus;
    requestDate: string;
}

export type EnrollmentWithDetails = Enrollment & { studentName: string; courseName: string };

export interface Feedback {
    id: string;
    studentId: string;
    courseId: string;
    teacherId: string;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    comment: string;
    date: string;
}