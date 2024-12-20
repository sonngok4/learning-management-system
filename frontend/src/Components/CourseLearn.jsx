import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import HomeLayout from "../Layouts/HomeLayout";

function CourseLearn() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [activeLesson, setActiveLesson] = useState(0);
    const { isEnrolled } = useSelector((state) => state.enrollment);
    const { role } = useSelector((state) => state.auth);

    useEffect(() => {
        // Redirect if not enrolled and not admin
        if (!isEnrolled && role !== "admin") {
            navigate(`/course/description`, { state });
        }
    }, [isEnrolled, role, navigate, state]);

    const handleNextLesson = () => {
        if (activeLesson < state?.lessons?.length - 1) {
            setActiveLesson(prev => prev + 1);
        }
    };

    const handlePreviousLesson = () => {
        if (activeLesson > 0) {
            setActiveLesson(prev => prev - 1);
        }
    };

    function getYouTubeVideoId(url) {
        const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        return match && match[1]; // Nếu tìm thấy videoId, trả về nó
    }


    return (
        <HomeLayout>
            <div className="flex lg:flex-row flex-col gap-5 px-4 lg:px-10 py-12 text-white">
                {/* Main Content Area */}
                <div className="space-y-4 w-full lg:w-[70%]">
                    {/* Video Player */}
                    <div className="bg-black rounded-lg overflow-hidden aspect-video">
                        {state?.lessons[activeLesson]?.videoUrl ? (
                            // Kiểm tra nếu video là từ YouTube
                            state?.lessons[activeLesson]?.videoUrl.includes("youtube.com") ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(state?.lessons[activeLesson]?.videoUrl)}`}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="YouTube Video"
                                ></iframe>
                            ) : (
                                // Nếu không phải YouTube, sử dụng thẻ video thông thường
                                <video
                                    className="w-full h-full"
                                    controls
                                    src={state?.lessons[activeLesson]?.videoUrl}
                                />
                            )
                        ) : (
                            <div className="flex justify-center items-center w-full h-full">
                                <p className="text-xl">No video available</p>
                            </div>
                        )}
                    </div>

                    {/* Lesson Navigation */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePreviousLesson}
                            disabled={activeLesson === 0}
                            className="flex items-center gap-2 bg-gray-700 disabled:bg-gray-600 px-4 py-2 rounded-lg disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft />
                            Previous
                        </button>
                        <button
                            onClick={handleNextLesson}
                            disabled={activeLesson === state?.lessons?.length - 1}
                            className="flex items-center gap-2 bg-gray-700 disabled:bg-gray-600 px-4 py-2 rounded-lg disabled:cursor-not-allowed"
                        >
                            Next
                            <FaChevronRight />
                        </button>
                    </div>

                    {/* Lesson Content */}
                    <div className="space-y-4 bg-gray-800 p-6 rounded-xl">
                        <h1 className="font-bold text-2xl text-yellow-500">
                            {state?.lessons[activeLesson]?.title}
                        </h1>
                        <div className="max-w-none prose-invert prose">
                            <p>{state?.lessons[activeLesson]?.content}</p>
                        </div>

                        {/* Resources Section */}
                        {state?.lessons[activeLesson]?.resources?.length > 0 && (
                            <div className="mt-6">
                                <h2 className="mb-3 font-semibold text-xl">Resources</h2>
                                <div className="space-y-2">
                                    {state?.lessons[activeLesson]?.resources.map((resource, index) => (
                                        <a
                                            key={index}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors"
                                        >
                                            {resource.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lesson List Sidebar */}
                <div className="bg-gray-800 p-4 rounded-xl w-full lg:w-[30%] h-fit">
                    <h2 className="mb-4 font-bold text-xl">Course Content</h2>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                        {state?.lessons?.map((lesson, index) => (
                            <div
                                key={lesson._id || index}
                                onClick={() => setActiveLesson(index)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeLesson === index
                                    ? 'bg-yellow-600'
                                    : 'hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    {lesson.videoUrl ? (
                                        <FaPlay className="w-4 h-4" />
                                    ) : (
                                        <div className="border-2 border-gray-400 rounded-full w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-medium">{lesson.title}</h3>
                                    {lesson.duration > 0 && (
                                        <p className="text-gray-400 text-sm">
                                            Duration: {lesson.duration} minutes
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseLearn;