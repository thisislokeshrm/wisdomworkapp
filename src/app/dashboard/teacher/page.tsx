// src/pages/dashboard/teacher.tsx
"use client";

import { auth, db } from "@/utils/firebase";
import Sidebar from "../../components/layouts/Sidebar";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useAuthState as useFirebaseAuthState } from "react-firebase-hooks/auth";

// Types for fetched data
interface UserInfo {
  name: string;
  location: string;
  profilePic: string;
}

interface Student {
  id: string;
  name: string;
  contact: string;
  email: string;
  sharedDate: string;
}

interface Course {
  id: string;
  coverImage: string;
  description: string;
  lessons: number;
  name: string;
}

const TeacherDashboard = () => {
  const [user] = useFirebaseAuthState(auth); // Track current user
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    location: "",
    profilePic: "",
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({ students: 0, courses: 0, enrolled: 0 });

  // Fetch teacher info from Firebase
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            name: data.name || "Teacher",
            location: data.location || "Unknown Location",
            profilePic: data.profilePic || "/default-profile.png",
          });
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  // Fetch only students from Firebase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const studentsSnapshot = await getDocs(q);
        const studentsData = studentsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Student[];
        setStudents(studentsData);

        // Update student count in stats
        setStats((prev) => ({ ...prev, students: studentsData.length }));
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, []);

  // Fetch courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesData = coursesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);

        // Update course count in stats
        setStats((prev) => ({ ...prev, courses: coursesData.length }));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const teacherTabs = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard/teacher" },
    { name: "Courses", icon: "📚", path: "/dashboard/teacher/courses" },
    { name: "Projects", icon: "📝", path: "/dashboard/teacher/projects" },
    { name: "Assessments", icon: "📂", path: "/dashboard/teacher/assignments" },
    { name: "Jobs", icon: "💼", path: "/dashboard/teacher/jobs" },
    { name: "Students", icon: "🎓", path: "/dashboard/teacher/students" },
    { name: "Blogs", icon: "✍️", path: "/dashboard/teacher/blogs" },
  ];

  return (
    <div className="flex">
      <div className="fixed h-full w-64"> {/* Fixed Sidebar */}
        <Sidebar
          tabs={teacherTabs}
          profilePic={userInfo.profilePic}
          userName={userInfo.name}
          userLocation={userInfo.location}
          logoSrc="/assets/images/logo.png"
        />
      </div>

      <div className="dashboard-content w-full p-6 ml-64 bg-[#eceff3]"> {/* Adjusted margin and background color */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-4">🤝</span> {/* Handshake emoji */}
            <h1 className="text-2xl font-bold">Hi, {userInfo.name}</h1> {/* Welcome message */}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-200 px-4 py-2 rounded-full focus:outline-none"
            />
            <span className="cursor-pointer text-xl">🔔</span> {/* Notifications icon */}
            <span className="cursor-pointer text-xl">✉️</span> {/* Messaging icon */}
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Dashboard</h2> {/* Dashboard title */}

        <div className="grid grid-cols-3 gap-4">
          <StatsCard icon="🎓" label="Students" value={stats.students.toString()} />
          <StatsCard icon="📚" label="Courses" value={stats.courses.toString()} />
          <StatsCard icon="📝" label="Enrolled Students" value={stats.enrolled.toString()} />
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="col-span-2 bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">All Students</h2>
            <StudentsTable students={students} />
          </div>

          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Student Performance</h2>
            <div className="h-40">Performance chart placeholder</div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Courses Uploaded Recently</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;

const StatsCard = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
    <span className="bg-gray-500 p-3 rounded-full text-white">{icon}</span>
    <div className="ml-4">
      <h2 className="text-lg font-semibold">{label}</h2>
      <p className="text-2xl">{value}</p>
    </div>
  </div>
);

const StudentsTable = ({ students }: { students: Student[] }) => (
  <div className="overflow-y-auto h-72">
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-500">
          <th>Name</th>
          <th>Date Shared</th>
          <th>Contact</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="border-b">
            <td>{student.name}</td>
            <td>{student.sharedDate}</td>
            <td>{student.contact}</td>
            <td>{student.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CourseCard = ({ course }: { course: Course }) => (
  <div className="course-card border p-4 rounded-lg shadow-md bg-[#FFFFFF]">
    <img
      src={course.coverImage}
      alt={course.name}
      className="w-full h-40 object-cover mb-2 rounded-lg"
    />
    <h3 className="text-xl font-semibold mb-1">{course.name}</h3>
    <p className="text-gray-500 mb-1">{course.description}</p>
    <p className="text-gray-700 mb-2">{course.lessons} lessons</p>
  </div>
);
