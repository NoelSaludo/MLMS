'use client'

import { useState, SubmitEvent as SyntheticEvent } from 'react'
import { apiClient } from '@/lib/api_client'
import { uploadFile } from '@/services/file_services'
import { TextAreaFormComponent, TextInputFormComponent } from '../forms/textInputFormComponent'
import FileInputFormComponent from '../forms/FileInputFormComponent'
import { NumberInputFormComponent } from '../forms/NumberInputFormComponent'
import { DateInputFormComponent } from '../forms/DateInputFormComponent'

export default function AssignAnAssignmentForm({ courseId }: { courseId: string }) {
    const [assignmenttitle, setAssignmenttitle] = useState('')
    const [assignmentdescription, setAssignmentdescription] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [score, setscore] = useState<number | null>(null)
    const [dueDate, setdue_date] = useState<string>('')

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData()
        formData.append('course_id', courseId)
        formData.append('title', assignmenttitle)
        formData.append('description', assignmentdescription)
        if (file) {
            const filePath = await uploadFile(file, courseId) // Assuming courseId is used as the title for the file upload
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
                alert("Failed to assign an assignment. Please try again.")
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
            <TextInputFormComponent label="Assignment Title" value={assignmenttitle} onchange={setAssignmenttitle} required />
            <TextAreaFormComponent label="Assignment Description" value={assignmentdescription} onchange={setAssignmentdescription} required />
            <FileInputFormComponent label="Upload Assignment File" onchange={setFile} required />
            <NumberInputFormComponent label="Score" value={score} onchange={setscore} required />
            <DateInputFormComponent label="Due Date" value={dueDate} onchange={setdue_date} required />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Assign Assignment
            </button>
        </form>
    )
}