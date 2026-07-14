'use client'

import { useState, SubmitEvent as SyntheticEvent } from 'react'
import { apiClient } from '@/lib/api_client'

export default function AssignAnAssignmentForm({courseId}: {courseId: string}) {
    const [assignmenttitle, setAssignmenttitle] = useState('')
    const [assignmentdescription, setAssignmentdescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [score, setscore] = useState<number | null>(null)
    const [dueDate, setdue_date] = useState<string>('')

    // TODO: Refactor this to use the action method of the form tag
    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData()
        formData.append('course_id', courseId)
        formData.append('title', assignmenttitle)
        formData.append('description', assignmentdescription)
        if (file) {
            const fileData = new FormData()
            fileData.append('file', file)
            fileData.append('course_title', courseId) // Assuming courseId is used as the title for the file upload
            const filePath = await apiClient.post('/upload/', fileData)
            formData.append('filepath_attachment', filePath)
        }
        if (score !== null) {
            formData.append('score', score.toString())
        }
        formData.append('due_date', dueDate)

        try {
            const data = await apiClient.post(`/course/${courseId}/assignment`, formData)
            if (!data || !data.status || data.status !== "success") {
                console.log("Failed to assign an assignment.")
                return
            }
            
            setAssignmenttitle('')
            setAssignmentdescription('')
            setFile(null)
            setscore(null)
            setdue_date('')
            alert("Assignment assigned successfully!")
            window.location.reload()
        } catch (error) {
            console.error("Error assigning assignment:", error)
            alert("An error occurred while assigning the assignment. Please try again.")
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