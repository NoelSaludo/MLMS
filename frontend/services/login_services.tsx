import { useEffect, useState } from "react";

var serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export async function getUser(email: string) {
    const response = await fetch(`${serverUrl}/user/${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("User not found");
    }

    const data = await response.json();
    return data;
}