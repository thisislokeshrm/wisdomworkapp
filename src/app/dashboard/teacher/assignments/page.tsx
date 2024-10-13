"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Sidebar from '../../../components/layouts/Sidebar';

interface UserInfo {
  name: string;
  location: string;
  profilePic: string;
}

interface Assessment {
  id?: string;
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
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // User information state
  const [formData, setFormData] = useState<Assessment>({
    title: "",
    dateShared: "",
    contact: "",
    email: "",
    status: "Pending",
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // ID of the assignment being edited

  useEffect(() => {
    // Fetch user information dynamically from Firebase
    const fetchUserInfo = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid); // Assuming user data is stored in 'users' collection
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserInfo(userDoc.data() as UserInfo);
        }
      }
    };

    // Fetch assessments and calculate stats dynamically from Firebase
    const fetchAssessments = async () => {
      const assessmentsCollection = collection(db, "assessments");
      const snapshot = await getDocs(assessmentsCollection);
      const assessmentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Assessment[];

      setAssessments(assessmentList);

      // Calculate stats
      const pending = assessmentList.filter((a) => a.status === "Pending").length;
      const completed = assessmentList.filter((a) => a.status === "Submitted").length;
      setTotalAssessments(assessmentList.length);
      setPendingAssessments(pending);
      setCompletedAssessments(completed);
    };

    if (user) {
      fetchUserInfo();
      fetchAssessments();
    }
  }, [user]);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle new assignment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedId) {
      // Update existing assignment
      const assignmentDocRef = doc(db, "assessments", selectedId);
      await updateDoc(assignmentDocRef, { ...formData });
      setIsEditing(false);
      setSelectedId(null);
    } else {
      // Add new assignment
      const assessmentsCollection = collection(db, "assessments");
      await addDoc(assessmentsCollection, formData);
    }

    // Reset form and refetch assessments
    setFormData({ title: "", dateShared: "", contact: "", email: "", status: "Pending" });
    const fetchAssessments = async () => {
      const assessmentsCollection = collection(db, "assessments");
      const snapshot = await getDocs(assessmentsCollection);
      const assessmentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Assessment[];
      setAssessments(assessmentList);
    };
    fetchAssessments();
  };

  // Handle assignment edit
  const handleEdit = (assessment: Assessment) => {
    setFormData(assessment);
    setIsEditing(true);
    setSelectedId(assessment.id!); // Use non-null assertion for the ID
  };

  if (!userInfo) {
    return <div>Loading...</div>;
  }

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
      <div className="dashboard-content w-full p-6 ml-64 bg-[#eceff3]">
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

        {/* Assignment Form */}
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-bold text-xl mb-4">{isEditing ? "Edit Assignment" : "Create New Assignment"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="date"
                name="dateShared"
                value={formData.dateShared}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="contact"
                placeholder="Contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Submitted">Submitted</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
            >
              {isEditing ? "Update Assignment" : "Create Assignment"}
            </button>
          </form>
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
                <th className="border-b py-2 px-4">Actions</th>
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
                  <td className="border-b py-2 px-4">
                    <button
                      onClick={() => handleEdit(assessment)}
                      className="text-blue-500"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
