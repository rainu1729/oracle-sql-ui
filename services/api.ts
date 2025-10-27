
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

// --- MOCK DATABASE ---

const users: User[] = [
    { id: 'admin1', name: 'Admin User', email: 'admin@test.com', role: UserRole.ADMIN },
    { id: 'teacher1', name: 'Dr. Alice Smith', email: 'teacher@test.com', role: UserRole.TEACHER, courseIds: ['course1', 'course2'], specialization: 'Database Design' },
    { id: 'teacher2', name: 'Prof. Bob Johnson', email: 'bob@test.com', role: UserRole.TEACHER, courseIds: ['course3'], specialization: 'Data Warehousing' },
    { id: 'student1', name: 'Charlie Brown', email: 'student@test.com', role: UserRole.STUDENT, enrolledCourseIds: ['course1', 'course3'], joinDate: '2023-01-15' },
    { id: 'student2', name: 'Diana Prince', email: 'diana@test.com', role: UserRole.STUDENT, enrolledCourseIds: ['course2'], joinDate: '2023-02-20' },
    { id: 'student3', name: 'Eve Adams', email: 'eve@test.com', role: UserRole.STUDENT, enrolledCourseIds: ['course1'], joinDate: '2023-03-10' },
];

const courses: Course[] = [
    { id: 'course1', name: 'Introduction to SQL', description: 'Learn the basics of SQL and database management.', teacherId: 'teacher1', capacity: 30, duration: '8 Weeks', startDate: '2023-09-01', endDate: '2023-10-27' },
    { id: 'course2', name: 'Advanced SQL Queries', description: 'Master complex queries, joins, and subqueries.', teacherId: 'teacher1', capacity: 25, duration: '6 Weeks', startDate: '2023-09-01', endDate: '2023-10-13' },
    { id: 'course3', name: 'Database Optimization', description: 'Techniques for optimizing database performance.', teacherId: 'teacher2', capacity: 20, duration: '10 Weeks', startDate: '2023-09-15', endDate: '2023-11-24' },
];

let enrollments: Enrollment[] = [
    { id: 'enroll1', studentId: 'student1', courseId: 'course1', status: 'approved', requestDate: '2023-01-10' },
    { id: 'enroll2', studentId: 'student1', courseId: 'course3', status: 'approved', requestDate: '2023-01-12' },
    { id: 'enroll3', studentId: 'student2', courseId: 'course2', status: 'approved', requestDate: '2023-02-15' },
    { id: 'enroll4', studentId: 'student3', courseId: 'course1', status: 'pending', requestDate: '2023-03-05' },
    { id: 'enroll5', studentId: 'student2', courseId: 'course1', status: 'pending', requestDate: '2023-08-20' },
];

let feedback: Feedback[] = [
    { id: 'fb1', studentId: 'student1', courseId: 'course1', teacherId: 'teacher1', grade: 'A', comment: 'Excellent progress, very engaged in class.', date: '2023-10-15' },
    { id: 'fb2', studentId: 'student2', courseId: 'course2', teacherId: 'teacher1', grade: 'B', comment: 'Good understanding of the concepts, could participate more.', date: '2023-10-05' },
];

// --- API FUNCTIONS ---

const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email: string, password: string): Promise<User | null> => {
    await simulateDelay(500);
    if (password !== 'password') return null; // Simple password check
    const user = users.find(u => u.email === email);
    return user || null;
};

export const getTeachers = async (): Promise<Teacher[]> => {
    await simulateDelay(300);
    return users.filter(u => u.role === UserRole.TEACHER) as Teacher[];
};

export const getStudents = async (): Promise<Student[]> => {
    await simulateDelay(300);
    return users.filter(u => u.role === UserRole.STUDENT) as Student[];
};

export const getCourses = async (): Promise<Course[]> => {
    await simulateDelay(300);
    return [...courses];
};

export const getCoursesForTeacher = async (teacherId: string): Promise<Course[]> => {
    await simulateDelay(300);
    return courses.filter(c => c.teacherId === teacherId);
};

export const getEnrollmentsForTeacher = async (teacherId: string): Promise<EnrollmentWithDetails[]> => {
    await simulateDelay(400);
    const teacherCourses = courses.filter(c => c.teacherId === teacherId).map(c => c.id);
    const relevantEnrollments = enrollments.filter(e => teacherCourses.includes(e.courseId));

    const studentsMap = new Map(users.filter(u => u.role === UserRole.STUDENT).map(s => [s.id, s.name]));
    const coursesMap = new Map(courses.map(c => [c.id, c.name]));

    return relevantEnrollments.map(e => ({
        ...e,
        studentName: studentsMap.get(e.studentId) || 'Unknown Student',
        courseName: coursesMap.get(e.courseId) || 'Unknown Course',
    }));
};

export const updateEnrollmentStatus = async (enrollmentId: string, status: EnrollmentStatus): Promise<boolean> => {
    await simulateDelay(200);
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (enrollment) {
        enrollment.status = status;
        if (status === 'approved') {
            const student = users.find(u => u.id === enrollment.studentId) as Student;
            if (student && !student.enrolledCourseIds.includes(enrollment.courseId)) {
                student.enrolledCourseIds.push(enrollment.courseId);
            }
        }
        return true;
    }
    return false;
};

export const getFeedbackForTeacher = async (teacherId: string): Promise<Feedback[]> => {
    await simulateDelay(300);
    return feedback.filter(f => f.teacherId === teacherId);
};

export const getEnrolledStudentsForCourse = async (courseId: string): Promise<Student[]> => {
    await simulateDelay(300);
    const approvedEnrollments = enrollments.filter(e => e.courseId === courseId && e.status === 'approved');
    const studentIds = new Set(approvedEnrollments.map(e => e.studentId));
    return users.filter(u => u.role === UserRole.STUDENT && studentIds.has(u.id)) as Student[];
};

export const updateFeedback = async (feedbackId: string, data: { comment: string; grade: 'A' | 'B' | 'C' | 'D' | 'F' }): Promise<Feedback | null> => {
    await simulateDelay(200);
    const fb = feedback.find(f => f.id === feedbackId);
    if (fb) {
        fb.comment = data.comment;
        fb.grade = data.grade;
        fb.date = new Date().toISOString().split('T')[0]; // Update date
        return { ...fb };
    }
    return null;
};

export const addFeedback = async (data: Omit<Feedback, 'id' | 'date'>): Promise<Feedback> => {
    await simulateDelay(200);
    const newFeedback: Feedback = {
        ...data,
        id: `fb${feedback.length + 1}`,
        date: new Date().toISOString().split('T')[0],
    };
    feedback.push(newFeedback);
    return newFeedback;
};

export const getFeedbackForStudent = async (studentId: string): Promise<Feedback[]> => {
    await simulateDelay(300);
    return feedback.filter(f => f.studentId === studentId);
};
