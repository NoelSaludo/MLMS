'use client'

import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(()=> {
    setLoading(true)
    
    async function fetchCourses() {
      
      
    }
    fetchCourses()
  }, [])

  return (<p>homepage</p>)
}
