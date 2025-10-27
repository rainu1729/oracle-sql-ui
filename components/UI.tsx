import React, { PropsWithChildren } from 'react';

// Card
interface CardProps extends React.HTMLAttributes<HTMLDivElement> { }
export const Card: React.FC<CardProps> = ({ className, children, ...props }) => (
    <div className={`bg-white rounded-lg shadow p-6 ${className || ''}`} {...props}>
        {children}
    </div>
);

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }
export const Input: React.FC<InputProps> = ({ className, ...props }) => (
    <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className || ''}`}
        {...props}
    />
);

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }
export const Textarea: React.FC<TextareaProps> = ({ className, ...props }) => (
    <textarea
        rows={4}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className || ''}`}
        {...props}
    />
);

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }
export const Select: React.FC<SelectProps> = ({ className, children, ...props }) => (
    <select
        className={`w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className || ''}`}
        {...props}
    >
        {children}
    </select>
);

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { }
export const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => (
    <button
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed ${className || ''}`}
        {...props}
    >
        {children}
    </button>
);

// Modal
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
}
export const Modal: React.FC<PropsWithChildren<ModalProps>> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
                </div>
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};