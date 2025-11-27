import React from 'react';

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} Roommates. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
