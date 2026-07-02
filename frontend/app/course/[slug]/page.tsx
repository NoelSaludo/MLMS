'use client'

import { use } from "react";

export default function CoursePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = use(params);

    // given the ID of the course, fetch the course data from the backend and display it

    return (
        <div>
            <h1>Course Page</h1>
            <p>Slug: {slug}</p>
        </div>
    );
}