import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      {courses.length === 0 ? (
        <p>No courses added yet.</p>
      ) : (
        <ul className="space-y-2">
          {courses.map((c) => (
            <li key={c._id} className="bg-white p-4 rounded shadow">
              <h2 className="font-semibold">{c.title}</h2>
              {c.platform && <p>Platform: {c.platform}</p>}
              {c.link && (
                <a href={c.link} target="_blank" className="text-blue-500">
                  Visit
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
