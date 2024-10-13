"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from '../../../components/layouts/Sidebar';

interface UserInfo {
  name: string;
  location: string;
  profilePic: string;
}

interface Assessment {
  id: string;
  title: string;
  dateShared: string;
  contact: string;
  email: string;
  status: string;
}

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [totalAssessments, setTotalAssessments] = useState<number>(0);
  const [pendingAssessments, setPendingAssessments] = useState<number>(0);
  const [completedAssessments, setCompletedAssessments] = useState<number>(0);
  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    location: "",
    profilePic: "",
  });

  useEffect(() => {
    if (user) {
      // Fetch user info dynamically from Firestore based on logged-in user
      const fetchUserInfo = async () => {
        const userDoc = await getDocs(collection(db, "users"));
        const userData = userDoc.docs
          .find(doc => doc.id === user.uid)?.data() as UserInfo;

        if (userData) {
          setUserInfo({
            name: userData.name || user.displayName || "User",
            location: userData.location || "Unknown Location",
            profilePic: userData.profilePic || "/default-profile-pic.jpg",
          });
        }
      };
      fetchUserInfo();
    }
  }, [user]);

  useEffect(() => {
    const fetchAssessments = async () => {
      const assessmentsCollection = collection(db, "assessments");
      const assessmentsSnapshot = await getDocs(assessmentsCollection);
      const assessmentList = assessmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Assessment[];

      setAssessments(assessmentList);

      // Calculate stats dynamically
      const pending = assessmentList.filter((a) => a.status === "Pending").length;
      const completed = assessmentList.filter((a) => a.status === "Submitted").length;
      setTotalAssessments(assessmentList.length);
      setPendingAssessments(pending);
      setCompletedAssessments(completed);
    };

    fetchAssessments();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar
        tabs={[
          { name: "Dashboard", icon: "🏠", path: "/dashboard/teacher" },
          { name: "Courses Dashboard", icon: "📚", path: "/dashboard/teacher/courses" },
          { name: "Project Dashboard", icon: "📁", path: "/dashboard/teacher/projects" },
          { name: "Assessment Dashboard", icon: "📝", path: "/dashboard/teacher/assessments" },
          { name: "Job Dashboard", icon: "💼", path: "/dashboard/teacher/jobs" },
          { name: "Student Dashboard", icon: "🎓", path: "/dashboard/teacher/students" },
          { name: "Blogs Dashboard", icon: "✍️", path: "/dashboard/teacher/blogs" },
        ]}
        profilePic={userInfo.profilePic}
        userName={userInfo.name}
        userLocation={userInfo.location}
        logoSrc="/assets/images/logo.png"
      />

      {/* Main Content */}
      <div className="dashboard-content w-full p-6  bg-[#eceff3]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-4">👋</span>
            <h1 className="text-2xl font-bold">Hi, {userInfo.name}</h1>
            <span className="ml-4 text-orange-500 cursor-pointer">Manage Attendance</span>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-200 px-4 py-2 rounded-full focus:outline-none"
            />
            <span className="text-xl cursor-pointer">🔔</span>
            <span className="text-xl cursor-pointer">✉️</span>
            <img
              src={userInfo.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
        </div>

        {/* Assessment Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-200 p-6 rounded shadow text-center">
            <h2 className="font-bold text-xl">Total Assessments</h2>
            <p className="text-4xl">{totalAssessments}</p>
          </div>
          <div className="bg-red-200 p-6 rounded shadow text-center">
            <h2 className="font-bold text-xl">Pending Assessments</h2>
            <p className="text-4xl">{pendingAssessments}</p>
          </div>
          <div className="bg-green-200 p-6 rounded shadow text-center">
            <h2 className="font-bold text-xl">Completed Assessments</h2>
            <p className="text-4xl">{completedAssessments}</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-bold text-xl mb-4">All Students</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border-b py-2 px-4">Student Name</th>
                <th className="border-b py-2 px-4">Date Shared</th>
                <th className="border-b py-2 px-4">Contact</th>
                <th className="border-b py-2 px-4">Email</th>
                <th className="border-b py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="border-b py-2 px-4">{assessment.title}</td>
                  <td className="border-b py-2 px-4">{assessment.dateShared}</td>
                  <td className="border-b py-2 px-4">{assessment.contact}</td>
                  <td className="border-b py-2 px-4">{assessment.email}</td>
                  <td className="border-b py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        assessment.status === "Submitted" ? "bg-green-200" : "bg-red-200"
                      }`}
                    >
                      {assessment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* New Assignment Button */}
        <button className="bg-orange-500 text-white px-4 py-2 rounded mt-4">
          New Assignment
        </button>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
