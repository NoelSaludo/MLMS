// the course dashboard component is a tabbed layout that displays the course annoucnements,
// materials, and members. the user can switch between the tabs to view the different sections of the course.
// the component fetches the course data from the backend and displays it in the appropriate tab.

'use client'

import { useState, useEffect } from 'react';

export default function CourseDashboard({ courseId }: { courseId: number }) {
    const [activeTab, setActiveTab] = useState<'announcements' | 'materials' | 'members'>('announcements');

    useEffect(() => {
        // fetch course data from backend using courseId
        // and set the state accordingly
    }, [courseId]);

    const handleTabClick = (tab: 'announcements' | 'materials' | 'members') => {
        setActiveTab(tab);
    };

    return (
        <div className="mt-4">
            <div className="flex border-b border-gray-300">  {/* Tabs */}
                <button
                    className={`px-4 py-2 ${activeTab === 'announcements' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => handleTabClick('announcements')}
                >
                    Announcements
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'materials' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => handleTabClick('materials')}
                >
                    Materials
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'members' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => handleTabClick('members')}
                >
                    Members
                </button>
            </div>
            <div className="p-4">  {/* Tab Content */}
                {activeTab === 'announcements' && (
                    <div>
                        <h2>Announcements</h2>
                        {/* Display announcements here */}
                    </div>
                )}
                {activeTab === 'materials' && (
                    <div>
                        <h2>Materials</h2>
                        {/* Display materials here */}
                    </div>
                )}
                {activeTab === 'members' && (
                    <div>
                        <h2>Members</h2>
                        {/* Display members here */}
                    </div>
                )}
            </div>
        </div>
    );
}