"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../../../utils/firebase";
import Sidebar from "../../../components/layouts/Sidebar";
import { useAuthState } from "react-firebase-hooks/auth";

interface UserInfo {
  name: string;
  location: string;
  profilePic: string;
}

const CoursesDashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [user] = useAuthState(auth); // Get the current user
  const [userInfo, setUserInfo] = useState({
    name: "",
    location: "",
    profilePic: "",
  });
  const [currentTab, setCurrentTab] = useState("Basic Information");

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid); // Assuming user info is stored in the "users" collection
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            name: data.name || "User",
            location: data.location || "Unknown Location",
            profilePic: data.profilePic || "/default-profile.png",
          });
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    const fetchCourses = async () => {
      const coursesCollection = collection(db, "courses");
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    };
    fetchCourses();
  }, []);

  const handleOpenModal = (course?: any) => {
    setCurrentCourse(
      course || {
        name: "",
        description: "",
        lessons: 0,
        coverImage: "",
        category: "",
        level: "",
        videoLink: "",
        sections: [],
        requirements: "",
      }
    );
    setShowModal(true);
    setFile(null); // Reset file when opening modal
  };

  const handleCloseModal = () => {
    setCurrentCourse(null);
    setShowModal(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    let coverImageUrl = currentCourse.coverImage;

    // Upload the image to Firebase Storage
    if (file) {
      const storageRef = ref(storage, `course_images/${file.name}`);
      await uploadBytes(storageRef, file);
      coverImageUrl = await getDownloadURL(storageRef); // Get the download URL
    }

    if (currentCourse.id) {
      // Update existing course
      const courseRef = doc(db, "courses", currentCourse.id);
      await updateDoc(courseRef, { ...currentCourse, coverImage: coverImageUrl });
      alert("Course updated successfully");
    } else {
      // Create new course
      await addDoc(collection(db, "courses"), {
        ...currentCourse,
        coverImage: coverImageUrl,
      });
      alert("Course created successfully");
    }
    handleCloseModal(); // Close modal after saving
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case "Basic Information":
        return (
          <>
            <input
              className="mb-2 p-2 border rounded w-full"
              placeholder="Course Name"
              value={currentCourse.name}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <input
              className="mb-2 p-2 border rounded w-full"
              placeholder="Course Category"
              value={currentCourse.category}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
            <input
              className="mb-2 p-2 border rounded w-full"
              placeholder="Course Level"
              value={currentCourse.level}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  level: e.target.value,
                }))
              }
            />
            <textarea
              className="mb-2 p-2 border rounded w-full"
              rows={4}
              placeholder="Course Description"
              value={currentCourse.description}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </>
        );
      case "Media":
        return (
          <>
            <input
              type="file"
              className="mb-2 p-2 border rounded w-full"
              onChange={handleFileChange}
            />
            <input
              className="mb-2 p-2 border rounded w-full"
              placeholder="Video Link"
              value={currentCourse.videoLink}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  videoLink: e.target.value,
                }))
              }
            />
          </>
        );
      case "Curriculum Design":
        return (
          <>
            <h3>Add Sections</h3>
            {currentCourse.sections.map((section: any, index: number) => (
              <div key={index}>
                <input
                  className="mb-2 p-2 border rounded w-full"
                  placeholder={`Section ${index + 1} Title`}
                  value={section.title}
                  onChange={(e) => {
                    const newSections = [...currentCourse.sections];
                    newSections[index].title = e.target.value;
                    setCurrentCourse((prev: any) => ({
                      ...prev,
                      sections: newSections,
                    }));
                  }}
                />
              </div>
            ))}
            <button
              className="mb-2 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  sections: [...prev.sections, { title: "" }],
                }))
              }
            >
              Add Section
            </button>
          </>
        );
      case "Requirements/Settings":
        return (
          <>
            <input
              className="mb-2 p-2 border rounded w-full"
              placeholder="Course Requirements"
              value={currentCourse.requirements}
              onChange={(e) =>
                setCurrentCourse((prev: any) => ({
                  ...prev,
                  requirements: e.target.value,
                }))
              }
            />
          </>
        );
      case "Preview and Publishing":
        return (
          <>
            <h3>Preview your course details here before publishing</h3>
            <button
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleSave}
            >
              Publish Course
            </button>
          </>
        );
      default:
        return null;
    }
  };

  const teacherTabs = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard/teacher" },
    { name: "Courses", icon: "📚", path: "/dashboard/teacher/courses" },
    { name: "Project", icon: "📝", path: "/dashboard/teacher/project" },
    { name: "Assessment", icon: "📂", path: "/dashboard/teacher/assignments" },
    { name: "Job", icon: "💼", path: "/dashboard/teacher/jobs" },
    { name: "Student", icon: "🎓", path: "/dashboard/teacher/students" },
    { name: "Blogs", icon: "✍️", path: "/dashboard/teacher/blogs" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed h-full w-64"> {/* Fixed Sidebar */} 
        <Sidebar
          tabs={teacherTabs}
          profilePic={userInfo.profilePic}
          userName={userInfo.name}
          userLocation={userInfo.location}
          logoSrc="/assets/images/logo.png"
        />
      </div>

      {/* Main Content */}
      <div className="dashboard-content w-full p-6 ml-64 bg-[#eceff3]">
        {/* Header */}
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
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Courses Dashboard</h1>
            <p className="text-gray-500">Manage your courses</p>
          </div>
          <div>
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Exit Manage Mode" : "Manage Courses"}
            </button>
          </div>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="course-card border p-4 rounded-lg shadow-md bg-white"
            >
              <img
                src={course.coverImage}
                alt={course.name}
                className="w-full h-40 object-cover mb-2 rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-1">{course.name}</h3>
              <p className="text-gray-500 mb-1">{course.description}</p>
              <p className="text-gray-700 mb-2">Lessons: {course.lessons}</p>
              {editMode && (
                <button
                  className="mb-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleOpenModal(course)}
                >
                  Edit Course
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Course Button */}
        {editMode && (
          <button
            className="fixed bottom-10 right-10 px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => handleOpenModal()}
          >
            Add New Course
          </button>
        )}
      </div>

      {/* Modal for Adding/Editing Courses */}
      {showModal && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg w-4/5 lg:w-1/2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {currentCourse.id ? "Edit Course" : "Create Course"}
              </h2>
              <button
                className="text-gray-600 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                ✖
              </button>
            </div>

            {/* Tabs */}
            <div className="tabs mb-4">
              {[
                "Basic Information",
                "Media",
                "Curriculum Design",
                "Requirements/Settings",
                "Preview and Publishing",
              ].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 border-b-2 ${
                    currentTab === tab ? "border-blue-500" : "border-gray-300"
                  }`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">{renderTabContent()}</div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              {currentTab === "Preview and Publishing" ? (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleSave}
                >
                  Save & Publish
                </button>
              ) : (
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => setCurrentTab("Preview and Publishing")}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesDashboard;
