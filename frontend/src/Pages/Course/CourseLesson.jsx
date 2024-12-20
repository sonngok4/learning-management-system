import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPlay } from 'react-icons/fa';
import HomeLayout from '../../Layouts/HomeLayout';


function CourseLessons() {
    const { state } = useLocation();
    const [activeLesson, setActiveLesson] = useState(0);

    return (
        <HomeLayout>
            <div className="flex lg:flex-row flex-col gap-5 px-5 lg:px-20 py-12 min-h-[90vh] text-white">
                {/* Video Player and Content Section */}
                <div className="space-y-3 w-full lg:w-[65%]">
                    <div className="bg-black aspect-video">
                        {state?.lessons[activeLesson]?.videoUrl ? (
                            <video
                                className="w-full h-full"
                                controls
                                src={state?.lessons[activeLesson]?.videoUrl}
                            >
                            </video>
                        ) : (
                            <div className="flex justify-center items-center w-full h-full">
                                <p className="font-semibold text-xl">No video available</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h2 className="font-bold text-2xl text-yellow-500">
                            {state?.lessons[activeLesson]?.title}
                        </h2>
                        <p className="text-gray-300">
                            {state?.lessons[activeLesson]?.content}
                        </p>
                    </div>
                </div>

                {/* Lessons List Section */}
                <div className="bg-gray-900 p-4 rounded-lg w-full lg:w-[35%]">
                    <h2 className="mb-4 font-bold text-2xl text-yellow-500">Course Content</h2>
                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                        {state?.lessons?.map((lesson, index) => (
                            <div
                                key={lesson._id || index}
                                onClick={() => setActiveLesson(index)}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeLesson === index
                                        ? 'bg-yellow-600'
                                        : 'hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex justify-center items-center bg-gray-700 rounded-full w-6 h-6">
                                    <FaPlay className="text-xs" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">{lesson.title}</h3>
                                    {lesson.duration && (
                                        <p className="text-gray-400 text-sm">
                                            Duration: {lesson.duration} min
                                        </p>
                                    )}
                                </div>
                                {lesson.isPreview && (
                                    <span className="bg-yellow-500 px-2 py-1 rounded text-xs">
                                        Preview
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </HomeLayout>
    );
}

export default CourseLessons;