import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center text-center">
            <h1 className="mb-4 text-9xl font-bold text-primary">404</h1>
            <h2 className="mb-8 text-2xl font-semibold">Page Not Found</h2>
            <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/">
                <Button>Go Home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
