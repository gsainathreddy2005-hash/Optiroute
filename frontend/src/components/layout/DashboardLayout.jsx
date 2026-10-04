import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({ children, title }) {
  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Area on the Right */}
      <div className="flex-1 pl-64 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
