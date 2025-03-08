import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 w-full border-t  py-6 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} CloudGram. All rights reserved.
        </p>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <a
            href="https://github.com/Arsenic-01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline hover:underline-offset-4"
          >
            Vedant Bhor
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
