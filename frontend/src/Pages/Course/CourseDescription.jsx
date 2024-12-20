import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../../Layouts/HomeLayout";
import { checkEnrollmentStatus, enrollInCourse } from "../../Redux/Slices/EnrollmentSlice";
import { addLesson } from "../../Redux/Slices/CourseSlice";

function CourseDescription() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { role, data } = useSelector((state) => state.auth);
    const { isEnrolled, loading } = useSelector((state) => state.enrollment);
    const [expandedLesson, setExpandedLesson] = useState(null);

    const [newLesson, setNewLesson] = useState({
        title: "",
        content: "",
        videoUrl: "",
        duration: 0,
        order: state?.lessons?.length || 0, // Mặc định là số lượng bài học hiện tại
    });

    const handleAddLesson = async () => {
        if (!newLesson.title || !newLesson.content) {
            toast.error("Please fill in all fields.");
            return;
        }

        try {
            // Gửi action thêm bài học vào backend
            await dispatch(addLesson({ courseId: state._id, lessonData: newLesson }));
            toast.success("Lesson added successfully!");
            setNewLesson({ title: "", content: "", videoUrl: "", duration: 0, order: state?.lessons?.length || 0 });
        } catch (error) {
            console.error("Error adding lesson:", error);
            toast.error("Failed to add lesson.");
        }
    };

    useEffect(() => {
        if (state?._id) {
            dispatch(checkEnrollmentStatus(state._id));
        }
    }, [state?._id, dispatch]);

    const handleEnrollment = async () => {
        if (!data) {
            toast.error("Please login to enroll");
            navigate("/login");
            return;
        }

        try {
            await dispatch(enrollInCourse(state._id)).unwrap();
            navigate("/course/learn", { state: { ...state } });
        } catch (error) {
            console.error("Enrollment failed:", error);
        }
    };

    const handleStartLearning = () => {
        navigate("/course/learn", { state: { ...state } });
    };

    const toggleLesson = (lessonId) => {
        setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
    };

    return (
        <HomeLayout>
            <div className="flex flex-col justify-center items-center md:px-20 pt-12 min-h-[90vh] text-white">
                <div className="relative gap-10 grid grid-cols-1 md:grid-cols-2 py-10 w-full max-w-[1200px]">
                    {/* Left Column - Course Details */}
                    <div className="space-y-5">
                        <img
                            className="rounded-xl w-full aspect-video object-cover"
                            alt="thumbnail"
                            src={state?.coverImage}
                        />

                        <div className="space-y-4">
                            <h1 className="font-bold text-3xl text-yellow-500">
                                {state?.name}
                            </h1>

                            <p className="text-gray-300">
                                {state?.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {state?.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-yellow-600 px-2 py-1 rounded text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Course Info & Enrollment */}
                    <div className="space-y-5">
                        <div className="space-y-4 bg-gray-800 p-6 rounded-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-2xl">Course Details</h2>
                                <p className="font-bold text-xl text-yellow-500">
                                    ${state?.price || 'Free'}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <p className="flex justify-between">
                                    <span>Instructor:</span>
                                    <span>{state?.instructor?.firstName} {state?.instructor?.lastName}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Level:</span>
                                    <span>{state?.level}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Total Lessons:</span>
                                    <span>{state?.lessons?.length || 0}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Category:</span>
                                    <span>{state?.category}</span>
                                </p>
                            </div>

                            {role === "admin" || isEnrolled ? (
                                <button
                                    onClick={handleStartLearning}
                                    className="bg-yellow-600 hover:bg-yellow-500 py-3 rounded-lg w-full font-semibold transition-all duration-300"
                                >
                                    Start Learning
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnrollment}
                                    disabled={loading}
                                    className="bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 py-3 rounded-lg w-full font-semibold transition-all duration-300"
                                >
                                    {loading ? "Enrolling..." : "Enroll Now"}
                                </button>
                            )}
                        </div>

                        {/* Preview Lessons */}
                        <div className="bg-gray-800 p-6 rounded-xl">
                            <h2 className="mb-4 font-bold text-xl">Course Content</h2>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {state?.lessons?.map((lesson, index) => (
                                    <div
                                        key={lesson._id || index}
                                        className="bg-gray-700 rounded-lg overflow-hidden"
                                    >
                                        <div
                                            className={`flex justify-between items-center p-3 cursor-pointer hover:bg-gray-600 transition-colors duration-300 ${lesson.isPreview ? 'hover:bg-gray-600' : ''}`}
                                            onClick={() => lesson.isPreview && toggleLesson(lesson._id)}
                                        >
                                            <span>{lesson.title}</span>
                                            {lesson.isPreview && (
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-yellow-600 px-2 py-1 rounded text-xs">
                                                        Preview
                                                    </span>
                                                    <span className="text-gray-300 text-xs">
                                                        {expandedLesson === lesson._id ? '▼' : '▶'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Preview Content */}
                                        {lesson.isPreview && expandedLesson === lesson._id && (
                                            <div className="border-gray-600 bg-gray-800 p-4 border-t">
                                                <div className="max-w-none prose-invert prose">
                                                    <p className="text-gray-300">{lesson.content}</p>
                                                    {lesson.videoUrl && (
                                                        <div className="mt-4">
                                                            <h4 className="mb-2 font-semibold text-sm">Preview Video</h4>
                                                            <video
                                                                controls
                                                                className="rounded w-full"
                                                                src={lesson.videoUrl}
                                                            >
                                                                Your browser does not support the video tag.
                                                            </video>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Only show the Add Lesson form for Instructor */}
            {role === "instructor" && (
                <div className="space-y-5 bg-gray-800 mt-10 p-6 rounded-xl">
                    <h2 className="font-bold text-xl text-yellow-500">Add New Lesson</h2>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Lesson Title"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                            className="bg-gray-700 p-3 rounded-lg w-full text-white"
                        />
                        <textarea
                            placeholder="Lesson Content"
                            value={newLesson.content}
                            onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                            className="bg-gray-700 p-3 rounded-lg w-full text-white"
                        />
                        <input
                            type="url"
                            placeholder="Video URL (optional)"
                            value={newLesson.videoUrl}
                            onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                            className="bg-gray-700 p-3 rounded-lg w-full text-white"
                        />
                        <input
                            type="number"
                            placeholder="Duration (minutes)"
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({ ...newLesson, duration: e.target.value })}
                            className="bg-gray-700 p-3 rounded-lg w-full text-white"
                        />
                        <button
                            onClick={handleAddLesson}
                            className="bg-yellow-600 hover:bg-yellow-500 py-3 rounded-lg w-full font-semibold transition-all duration-300"
                        >
                            Add Lesson
                        </button>
                    </div>
                </div>
            )}
        </HomeLayout>
    );
}

export default CourseDescription;