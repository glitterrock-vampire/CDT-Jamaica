import React from 'react';

const TicketButton = ({ href, children = "Get Tickets", className = "" }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-[0.16em] uppercase border border-transparent bg-orange-500 text-white hover:bg-orange-400 transition-colors`}
    >
      {children}
    </a>
  );
};

export default TicketButton;
