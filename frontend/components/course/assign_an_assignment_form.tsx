'use client'

import { useState } from 'react'

export default function AssignAnAssignmentForm() {
    const [assignmentTitle, setAssignmentTitle] = useState('')
    const [assignmentDescription, setAssignmentDescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [score, setScore] = useState<number | null>(null)
    const [dueDate, setDueDate] = useState<string>('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const response = await fetch('/api/upload/assignment', {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            alert('Assignment submitted successfully!')
            setAssignmentTitle('')
            setAssignmentDescription('')
            setFile(null)
            setScore(null)
            setDueDate('')
        } else {
            alert('Error submitting assignment.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="assignmentTitle" className="block text-sm font-medium text-gray-700">Assignment Title</label>
                <input
                    type="text"
                    id="assignmentTitle"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="assignmentDescription" className="block text-sm font-medium text-gray-700">Assignment Description</label>
                <textarea
                    id="assignmentDescription"
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">Upload File</label>
                <input
                    type="file"
                    id="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="mt-1 block w-full"
                />
            </div>
            <div>
                <label htmlFor="score" className="block text-sm font-medium text-gray-700">Score</label>
                <input
                    type="number"
                    id="score"
                    value={score ?? ''}
                    onChange={(e) => setScore(e.target.value ? parseInt(e.target.value) : null)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Assign Assignment
            </button>
        </form>
    )
}