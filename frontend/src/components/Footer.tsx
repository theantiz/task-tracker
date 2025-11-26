import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full text-center py-4 text-sm text-gray-500">
      © 2025 • Crafted with precision by Antiz -{" "}
      <a
        href="https://antiz.xyz"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        antiz.xyz
      </a>
    </footer>
  );
};

export default Footer;
