import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { updateCourse } from "../../Redux/Slices/CourseSlice";

function EditCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state } = useLocation();
    // console.log(state)
    const [userInput, setUserInput] = useState({
        id: state?._id,
        title: state?.title,
        category: state?.category,
        description: state?.description,
        createdBy: state?.createdBy,
        thumbnail: null,
        previewImage: state.thumbnail?.secure_url,
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setUserInput({
                    ...userInput,
                    previewImage: this.result,
                    thumbnail: uploadedImage
                })
            })
        }
    }

    function handleUserInput(e) {
        e.preventDefault();
        const { name, value } = e.target;
        setUserInput({
            ...userInput,
            [name]: value
        })
    }

    async function OnFormSubmit(e) {
        e.preventDefault();
        if (!userInput.title || !userInput.description || !userInput.category) {
            toast.error("All fields are mandatory");
            return;
        }

        const response = await dispatch(updateCourse(userInput));
        if (response?.payload?.success) {
            setUserInput({
                title: "",
                category: "",
                description: "",
                thumbnail: null,
            });
            navigate("/courses");
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center h-[100vh]">
                <form
                    onSubmit={OnFormSubmit}
                    className="relative flex flex-col justify-center gap-5 shadow-[0_0_10px_black] sm:my-10 mt-5 p-4 rounded-lg w-[80vw] md:w-[700px] text-white"
                >
                    <div>
                        <Link to={"/"} className="left-2 absolute text-accent text-lg cursor-pointer">
                            <AiOutlineArrowLeft />
                        </Link>
                    </div>

                    <h1 className="font-bold text-2xl text-center">
                        Edit Course
                    </h1>

                    <main className="gap-x-10 grid grid-cols-1 lg:grid-cols-2">
                        <div>
                            <div>
                                <label htmlFor="image_uploads" className="cursor-pointer">
                                    {userInput.previewImage ? (
                                        <img
                                            className="m-auto border w-full h-44"
                                            src={userInput.previewImage}
                                        />
                                    ) : (
                                        <div className="flex justify-center items-center m-auto border w-full h-44">
                                            <h1 className="font-bold text-lg">  Upload your course thumbnail</h1>
                                        </div>
                                    )}
                                </label>
                                <input
                                    className="hidden"
                                    type="file"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png"
                                    name="image_uploads"
                                    onChange={handleImageUpload}
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="title">
                                    Course title
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Enter course title"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.title}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div >

                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="createdBy">
                                    Course Instructor
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="createdBy"
                                    id="createdBy"
                                    placeholder="Enter course instructor"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.createdBy}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="category">
                                    Course category
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="category"
                                    id="category"
                                    placeholder="Enter course category"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="description">
                                    Course description
                                </label>
                                <textarea
                                    required
                                    type="text"
                                    name="description"
                                    id="description"
                                    placeholder="Enter course description"
                                    className="bg-transparent px-2 py-1 border h-24 overflow-scroll resize-none"
                                    value={userInput.description}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div>
                    </main>

                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 py-2 rounded-sm w-full font-semibold text-lg transition-all duration-300 ease-in-out">
                        Update Course
                    </button>

                </form>
            </div>
        </HomeLayout>
    )
}
export default EditCourse;