"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../utils/firebase"; // Ensure Firebase storage is initialized
import Sidebar from '../../../components/layouts/Sidebar'; // Import Sidebar

interface UserInfo {
  name: string;
  location: string;
  profilePic: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  category?: string;
  status?: string;
  coverImage?: string;
}

const ProjectsDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isManageMode, setIsManageMode] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<{ name: string; description: string; category: string; status: string; coverImage: string; }>({
    name: "",
    description: "",
    category: "",
    status: "Pending",
    coverImage: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [user] = useAuthState(auth);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    location: "",
    profilePic: "",
  });

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserInfo({
            name: data.name || "User",
            location: data.location || "Unknown Location",
            profilePic: data.profilePic || "/assets/images/default-pic.jpg",
          });
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const projectsCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectsCollection);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(projectList);
      setFilteredProjects(projectList);
    };
    fetchProjects();
  }, []);

  // Search function to filter projects
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  // Create new project
  const handleCreateProject = async () => {
    if (newProject.name && newProject.description) {
      let imageUrl = newProject.coverImage;

      // Upload the image to Firebase Storage if a file is selected
      if (imageFile) {
        const imageRef = ref(storage, `project_images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef); // Get the uploaded image URL
      }

      const newProjectRef = doc(collection(db, "projects"));
      await setDoc(newProjectRef, { ...newProject, coverImage: imageUrl });
      setProjects([...projects, { id: newProjectRef.id, ...newProject, coverImage: imageUrl }]);
      setFilteredProjects([...filteredProjects, { id: newProjectRef.id, ...newProject, coverImage: imageUrl }]);
      setShowForm(false);
      resetNewProject();
    }
  };

  // Update existing project
  const handleUpdateProject = async () => {
    if (editingProject) {
      let imageUrl = editingProject.coverImage;

      // Upload the image to Firebase Storage if a new file is selected
      if (imageFile) {
        const imageRef = ref(storage, `project_images/${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef); // Get the uploaded image URL
      }

      const projectRef = doc(db, "projects", editingProject.id);
      await setDoc(projectRef, { ...editingProject, coverImage: imageUrl });
      const updatedProjects = projects.map((project) =>
        project.id === editingProject.id ? { ...editingProject, coverImage: imageUrl } : project
      );
      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setEditingProject(null); // Reset editing state
    }
  };

  // Load project data into the editing state
  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
    setNewProject({
      name: project.name,
      description: project.description,
      category: project.category || "",
      status: project.status || "Pending",
      coverImage: project.coverImage || "",
    });
    setImageFile(null); // Clear the image file when editing
  };

  const resetNewProject = () => {
    setNewProject({ name: "", description: "", category: "", status: "Pending", coverImage: "" });
    setImageFile(null); // Reset image file
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
      <div className="fixed h-full w-64">
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
            <h1 className="text-2xl font-bold">Hi, {userInfo.name}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-200 px-4 py-2 rounded-full focus:outline-none"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <span className="cursor-pointer text-xl">🔔</span> {/* Notifications icon */}
            <span className="cursor-pointer text-xl">✉️</span> {/* Messaging icon */}
          </div>
        </div>

        {/* Projects Header Section */}
        <div
          className="relative w-full h-56 rounded-lg overflow-hidden mb-6"
          style={{
            backgroundImage: `url('/assets/images/background.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 flex justify-center items-center">
            <h1 className="text-white text-4xl font-bold">Discover Projects</h1>
          </div>
        </div>

        {/* Filters and Manage Button */}
        <div className="flex space-x-4 mb-4">
          <select
            onChange={(e) => handleSearch(e.target.value)}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="">All Categories</option>
            <option value="Art">Art</option>
            <option value="Technology">Technology</option>
            {/* Add more categories as needed */}
          </select>
          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className={`px-4 py-2 border border-gray-300 rounded-lg ${isManageMode ? "bg-red-500 text-white" : "bg-white text-black"}`}
          >
            {isManageMode ? "Stop Managing" : "Manage Projects"}
          </button>
        </div>

        {/* Projects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md p-4">
              <img src={project.coverImage || "/assets/images/default-cover.jpg"} alt={project.name} className="w-full h-40 object-cover rounded-md mb-2" />
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-500 mb-2">{project.description}</p>
              <span className="text-gray-500">Status: {project.status || "N/A"}</span>
              {isManageMode && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditClick(project)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Manage Projects Button */}
        {isManageMode && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              New Project
            </button>
          </div>
        )}

        {/* New Project Form / Edit Form */}
        {showForm && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">{editingProject ? "Edit Project" : "Create New Project"}</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="block w-full mb-4 border border-gray-300 p-2 rounded"
            />
            <textarea
              placeholder="Project Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="block w-full mb-4 border border-gray-300 p-2 rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} // Update imageFile state
              className="block w-full mb-4"
            />
            <button
              onClick={editingProject ? handleUpdateProject : handleCreateProject}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              {editingProject ? "Update Project" : "Create Project"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProject(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDashboard;
