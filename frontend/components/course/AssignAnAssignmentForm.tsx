'use client'

import { useState } from 'react'

export default function AssignAnAssignmentForm({courseId}: {courseId: string}) {
    const [assignmenttitle, setAssignmenttitle] = useState('')
    const [assignmentdescription, setAssignmentdescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [score, setscore] = useState<number | null>(null)
    const [dueDate, setdue_date] = useState<string>('')

    // TODO: Refactor this to use the action method of the form tag
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData()
        formData.append('courseId', courseId)
        formData.append('title', assignmenttitle)
        formData.append('description', assignmentdescription)
        if (file) {
            formData.append('fileattachment', file)
        }
        if (score !== null) {
            formData.append('score', score.toString())
        }
        formData.append('duedate', dueDate)

        const response = await fetch('/api/upload/assignment', {
            method: 'POST',
            body: formData
        })

        if (response.ok) {
            alert('Assignment submitted successfully!')
            window.location.reload()
        } else {
            alert('Error submitting assignment.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="assignmenttitle" className="block text-sm font-medium text-gray-700">Assignment title</label>
                <input
                    type="text"
                    id="assignmenttitle"
                    value={assignmenttitle}
                    onChange={(e) => setAssignmenttitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="assignmentdescription" className="block text-sm font-medium text-gray-700">Assignment description</label>
                <textarea
                    id="assignmentdescription"
                    value={assignmentdescription}
                    onChange={(e) => setAssignmentdescription(e.target.value)}
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
                <label htmlFor="score" className="block text-sm font-medium text-gray-700">score</label>
                <input
                    type="number"
                    id="score"
                    value={score ?? ''}
                    onChange={(e) => setscore(e.target.value ? parseInt(e.target.value) : null)}
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
                    onChange={(e) => setdue_date(e.target.value)}
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