
import { useSelector } from "react-redux";
import {  useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";

function CourseDescripition() {

    const {state}=useLocation();
    const navigate = useNavigate();
    
    const {role, data}=useSelector((state)=>state.auth)

    return(
        <HomeLayout>
            <div className="flex flex-col justify-center items-center md:px-20 pt-12 min-h-[90vh] text-white">
                <div className="flex flex-col justify-center items-center md:shadow-[0_0_10px_black] md:w-[50rem]">
                    <div className="mt-5">  
                        <h1 className="mb-2 font-bold text-3xl text-center text-yellow-500">
                            {state?.title}
                        </h1>
                    </div>
                    <div className="relative gap-5 md:gap-10 grid grid-cols-1 md:grid-cols-2 py-10 w-1/2 md:w-[80%]">

                        <div className="space-y-3">
                            <img
                                className="w-full h-64"
                                alt="thumbnail"
                                src={state?.coverImage}
                            />
                            <div className="space-y-1">
                                <div className="flex flex-col justify-center items-center text-xl">
                                        <p className="font-semibold">
                                                <span>
                                                    Total lectures :{" "}
                                                </span>
                                        {state?.lessons.length}
                                        </p>
                                        <p className="font-semibold">
                                                <span>
                                                    Instructor :{" "}
                                                </span>
                                                {`${state?.instructor?.firstName} ${state?.instructor?.lastName}`}
                                        </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-xl">
                            <p className="text-yellow-500">Course description:</p>
                            <p className="lg:h-60">{state?.description}</p>

                            {/* Kiểm tra điều kiện để hiển thị nút */}
                            {role === "admin" || data?.subscription?.status === "active" ? (
                                <button
                                    onClick={() => navigate("/course/displaylecture", { state: { ...state } })}
                                    className="bg-yellow-600 hover:bg-yellow-500 px-5 py-3 rounded-md w-full font-bold text-xl transition-all duration-300 ease-in-out"
                                >
                                    Watch lectures
                                </button>
                            ) : role === "instructor" ? (
                                <button
                                    onClick={() => navigate("/course/displaylecture", { state: { ...state } })}
                                    className="bg-yellow-600 hover:bg-yellow-500 px-5 py-3 rounded-md w-full font-bold text-xl transition-all duration-300 ease-in-out"
                                >
                                    Watch lessons
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/checkout")}
                                    className="bg-yellow-600 hover:bg-yellow-500 px-5 py-3 rounded-md w-full font-bold text-xl transition-all duration-300 ease-in-out"
                                >
                                    Subscribe
                                </button>
                            )}
                        </div>

                        
                    </div>
                </div>
            </div>  
        </HomeLayout>
    )
    
}
export default CourseDescripition;