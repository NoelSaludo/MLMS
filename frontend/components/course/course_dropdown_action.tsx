'use client'
import { useState } from 'react'

export default function CourseDropdownAction({ onCreateContent , setDropdownOpen}: { onCreateContent: () => void, setDropdownOpen: (open: boolean) => void }) {
    return (
        <div className="absolute bg-white border rounded shadow-lg p-4 mt-2">
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onCreateContent(); setDropdownOpen(false); }}>
                Make an Announcement
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onCreateContent(); setDropdownOpen(false); }}>
                Upload Course Material
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => { onCreateContent(); setDropdownOpen(false); }}>
                Assign an Assignment
            </button>
            <button className="block w-full text-left px-4 py-2 hover:bg-gray-100" onClick={() => setDropdownOpen(false)}>
                Cancel
            </button>
        </div>
    )
}
