
import React, { useState, useEffect } from 'react';
import * as API from '../services/api';
import { Feedback, Course } from '../types';
import { Card } from './UI';

interface ViewFeedbackProps {
    studentId: string;
}

type FeedbackWithCourse = Feedback & { courseName: string };

const ViewFeedback: React.FC<ViewFeedbackProps> = ({ studentId }) => {
    const [feedbacks, setFeedbacks] = useState<FeedbackWithCourse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            setIsLoading(true);
            const feedbackResults = await API.getFeedbackForStudent(studentId);
            const courses = await API.getCourses();
            const coursesMap = new Map(courses.map(c => [c.id, c.name]));

            const feedbackWithCourseNames = feedbackResults.map(f => ({
                ...f,
                courseName: coursesMap.get(f.courseId) || 'Unknown Course'
            }));

            setFeedbacks(feedbackWithCourseNames);
            setIsLoading(false);
        };
        fetchFeedback();
    }, [studentId]);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">My Feedback</h2>
            {isLoading ? (
                <p>Loading feedback...</p>
            ) : feedbacks.length > 0 ? (
                <div className="space-y-4">
                    {feedbacks.map(fb => (
                        <Card key={fb.id}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{fb.courseName}</h3>
                                    <p className="text-sm text-gray-500">Received on: {fb.date}</p>
                                </div>
                                <p className={`px-3 py-1 rounded-full text-white text-sm font-bold ${fb.grade === 'A' || fb.grade === 'B' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                                    Grade: {fb.grade}
                                </p>
                            </div>
                            <p className="mt-3 text-gray-700">{fb.comment}</p>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                  <p>No feedback available yet.</p>
                </Card>
            )}
        </div>
    );
};

export default ViewFeedback;
