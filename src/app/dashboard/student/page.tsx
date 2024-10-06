// src/pages/dashboard/student.tsx
"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../utils/firebase';
import Sidebar from '../../components/layouts/Sidebar';
import Card from '../../components/common/Card'; // Import reusable card component

const StudentDashboard = () => {
  // States
  const [view, setView] = useState<'dashboard' | 'courses' | 'projects' | 'jobs'>('dashboard');
  const [highlightedCard, setHighlightedCard] = useState<'courses' | 'projects' | 'jobs' | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  // Fetch Data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const projectsSnapshot = await getDocs(collection(db, 'projects'));
      const jobsSnapshot = await getDocs(collection(db, 'jobsApplied'));

      setCourses(coursesSnapshot.docs.map((doc) => doc.data()));
      setProjects(projectsSnapshot.docs.map((doc) => doc.data()));
      setJobs(jobsSnapshot.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, []);

  // Function to handle view changes and setting highlighted card
  const handleCardClick = (section: 'courses' | 'projects' | 'jobs') => {
    setView(section);
    setHighlightedCard(section);
  };

  return (
    <div className="dashboard-container flex">
      <Sidebar />
      <div className="dashboard-content w-full p-6">
        {view === 'dashboard' && (
          <div>
            <h1>Dashboard</h1>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div 
                className={`dashboard-box p-4 bg-yellow-100 rounded-lg cursor-pointer ${highlightedCard === 'courses' ? 'ring-4 ring-yellow-300' : ''}`} 
                onClick={() => handleCardClick('courses')}>
                <h3 className="font-bold text-lg">Total Completed Courses</h3>
                <p className="text-3xl">{courses.length}</p>
              </div>
              <div 
                className={`dashboard-box p-4 bg-gray-100 rounded-lg cursor-pointer ${highlightedCard === 'projects' ? 'ring-4 ring-gray-300' : ''}`} 
                onClick={() => handleCardClick('projects')}>
                <h3 className="font-bold text-lg">Project Enrolled</h3>
                <p className="text-3xl">{projects.length}</p>
              </div>
              <div 
                className={`dashboard-box p-4 bg-green-100 rounded-lg cursor-pointer ${highlightedCard === 'jobs' ? 'ring-4 ring-green-300' : ''}`} 
                onClick={() => handleCardClick('jobs')}>
                <h3 className="font-bold text-lg">Jobs Applied</h3>
                <p className="text-3xl">{jobs.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Courses View */}
        {view === 'courses' && (
          <div>
            <button className="text-blue-500 mb-4" onClick={() => setView('dashboard')}>
              ← Go Back to Dashboard
            </button>
            <h1>Courses</h1>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {courses.map((course, index) => (
                <Card 
                  key={index} 
                  title={course.title} 
                  description={course.description} 
                  progress={course.progress} 
                  category="courses"
                />
              ))}
            </div>
          </div>
        )}

        {/* Projects View */}
        {view === 'projects' && (
          <div>
            <button className="text-blue-500 mb-4" onClick={() => setView('dashboard')}>
              ← Go Back to Dashboard
            </button>
            <h1>Projects</h1>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {projects.map((project, index) => (
                <Card 
                  key={index} 
                  title={project.title} 
                  description={project.description} 
                  category="projects"
                />
              ))}
            </div>
          </div>
        )}

        {/* Jobs View */}
        {view === 'jobs' && (
          <div>
            <button className="text-blue-500 mb-4" onClick={() => setView('dashboard')}>
              ← Go Back to Dashboard
            </button>
            <h1>Jobs Applied</h1>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {jobs.map((job, index) => (
                <Card 
                  key={index} 
                  title={job.title} 
                  description={job.description} 
                  category="jobs"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
