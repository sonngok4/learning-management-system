import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

import HomeLayout from "../../Layouts/HomeLayout";
import { createNewCourse } from "../../Redux/Slices/CourseSlice";

function CreateCourse() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //for checking if user is logged in 
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // for displaying the options acc to role
    const role = useSelector((state) => state?.auth?.role);

    const [userInput, setUserInput] = useState({
        name: "",
        description: "",
        category: "",
        level: "Beginner",
        price: "",
        coverImage: "",
        previewImage: "",
        tags: [],
    });

    const categoryOptions = [
        { value: "Programming", label: "Programming" },
        { value: "Data Science", label: "Data Science" },
        { value: "Design", label: "Design" },
        { value: "Business", label: "Business" },
        { value: "Language", label: "Language" },
        { value: "Mathematics", label: "Mathematics" },
        { value: "Music", label: "Music" },
        { value: "Photography", label: "Photography" },
        { value: "Health & Fitness", label: "Health & Fitness" },
        { value: "Cooking", label: "Cooking" },
        { value: "Personal Development", label: "Personal Development" },
        { value: "Engineering", label: "Engineering" },
        { value: "AI & Machine Learning", label: "AI & Machine Learning" },
        { value: "Cybersecurity", label: "Cybersecurity" },
        { value: "Philosophy", label: "Philosophy" },
    ];


    const tagOptions = [
        { value: "React", label: "React" },
        { value: "JavaScript", label: "JavaScript" },
        { value: "Web Development", label: "Web Development" },
        { value: "Node.js", label: "Node.js" },
        { value: "CSS", label: "CSS" },
        { value: "HTML", label: "HTML" },
    ];

    // Hàm xử lý thay đổi của combo box
    const handleTagChange = (selectedOptions) => {
        const selectedTags = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setUserInput(prevState => ({
            ...prevState,
            tags: selectedTags,
        }));
    };


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
                    coverImage: uploadedImage
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
        // if (!userInput.name || !userInput.description || !userInput.category || !userInput.price) {
        //     toast.error("All fields are mandatory");
        //     return;
        // }

        if (!userInput.name) {
            toast.error("Course name is required");
            return;
        }

        if (!userInput.description) {
            toast.error("Course description is required");
            return;
        }

        if (!userInput.category) {
            toast.error("Category is required");
            return;
        }

        if (!userInput.price) {
            toast.error("Price is required");
            return;
        }

        if (!userInput.previewImage) {
            toast.error("Cover image is required");
            return;
        }


        if (!userInput.coverImage) {
            toast.error("Cover image is required");
            return;
        }
        if (userInput.tags.length === 0) {
            toast.error("At least one tag is required");
            return;
        }

        // Ensure level is selected
        if (!userInput.level) {
            toast.error("Course level is required.");
            return;
        }

        const response = await dispatch(createNewCourse(userInput));
        if (response?.payload?.success) {
            setUserInput({
                name: "",
                description: "",
                category: "",
                level: "",
                price: "",
                coverImage: "",
                tags: [],
            });
            navigate("/courses/my-courses");
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center h-[100vh]">
                <form
                    onSubmit={OnFormSubmit}
                    className="relative flex flex-col justify-center gap-2 md:gap-5 shadow-[0_0_10px_black] sm:my-10 mt-5 p-4 rounded-lg w-[80vw] md:w-[700px] text-white"
                >

                    <div>
                        <Link to={"/courses"} className="left-2 absolute text-accent text-xl cursor-pointer">
                            <AiOutlineArrowLeft />
                        </Link>
                    </div>

                    <h1 className="font-bold text-2xl text-center">
                        Create New Course
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
                                <label className="font-semibold text-lg" htmlFor="name">
                                    Course name
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter course name"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.name}
                                    onChange={handleUserInput}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="price">
                                    Course price
                                </label>
                                <input
                                    required
                                    type="number"
                                    min={0}
                                    defaultValue={0.0}
                                    name="price"
                                    id="price"
                                    placeholder="Enter course price"
                                    className="bg-transparent px-2 py-1 border"
                                    value={userInput.price}
                                    onChange={handleUserInput}
                                />
                            </div>
                        </div >

                        <div className="flex flex-col gap-1">
                            {isLoggedIn && role === "admin" && (
                                <div className="flex flex-col gap-1">
                                    <label className="font-semibold text-lg" htmlFor="instruc">
                                        Course Instructor
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        name="instructor"
                                        id="instructor"
                                        placeholder="Enter course instructor"
                                        className="bg-transparent px-2 py-1 border"
                                        value={userInput.instructor}
                                        onChange={handleUserInput}
                                    />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="category">
                                    Course category
                                </label>
                                <select
                                    required
                                    name="category"
                                    id="category"
                                    className="bg-slate-800 px-2 py-1 border max-h-[200px] overflow-y-auto"
                                    value={userInput.category}
                                    onChange={handleUserInput}
                                >
                                    {categoryOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1 bg-transparent">
                                <label className="font-semibold text-lg" htmlFor="level">
                                    Course level
                                </label>
                                <select className="bg-slate-800 px-2 py-1 rounded-sm" name="level" id="level" value={userInput.level || 'Beginner'}
                                    onChange={handleUserInput} >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
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

                            {/* Tags */}
                            <div className="flex flex-col gap-1">
                                <label className="font-semibold text-lg" htmlFor="tags">
                                    Course tags
                                </label>
                                <Select
                                    isMulti
                                    name="tags"
                                    options={tagOptions}
                                    value={userInput.tags.map(tag => ({ value: tag, label: tag }))}
                                    onChange={handleTagChange}
                                    placeholder="Select tags"
                                    className="bg-transparent text-black basic-multi-select"
                                    classNamePrefix="select"
                                />
                            </div>
                        </div>
                    </main>

                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 py-2 rounded-sm w-full font-semibold text-lg transition-all duration-300 ease-in-out">
                        Create Course
                    </button>

                </form>
            </div>
        </HomeLayout>
    )
}
export default CreateCourse;