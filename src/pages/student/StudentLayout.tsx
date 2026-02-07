/**
 * LIS v2.0 - Student Portal Layout
 * Main layout component for student pages
 */

import React, { useState } from 'react';

// Temporary stub components
const Sidebar = ({ isCollapsed, onToggle, children }: any) => <div>{children}</div>;
const NavItem = (props: any) => <div {...props} />;
const TopBar = (props: any) => <div {...props} />;
const MainContent = ({ children }: any) => <div>{children}</div>;

interface StudentLayoutProps {
  children: React.ReactNode;
  activePage: string;
  studentName?: string;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '🏠', href: '/student' },
  { id: 'courses', label: 'My Courses', icon: '📚', href: '/student/courses' },
  { id: 'feedback', label: 'My Feedback', icon: '💬', href: '/student/feedback' },
  { id: 'performance', label: 'Performance', icon: '📊', href: '/student/performance' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/student/settings' },
];

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  children,
  activePage,
  studentName = 'Student',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarWidth = isCollapsed ? 64 : 256;

  const getPageTitle = () => {
    const item = NAV_ITEMS.find(n => n.id === activePage);
    return item?.label || 'Student Portal';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)}>
        {/* Student Info */}
        {!isCollapsed && (
          <div className="px-4 py-3 mb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <span className="text-lg">👨‍🎓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{studentName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Student</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              icon={<span className="text-lg">{item.icon}</span>}
              label={item.label}
              href={item.href}
              isActive={activePage === item.id}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </Sidebar>

      <TopBar 
        title={getPageTitle()} 
        sidebarWidth={sidebarWidth}
      >
        {/* Notification Bell */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <span className="text-sm">👨‍🎓</span>
          </div>
        </div>
      </TopBar>

      <MainContent sidebarWidth={sidebarWidth}>
        {children}
      </MainContent>
    </div>
  );
};

export default StudentLayout;
