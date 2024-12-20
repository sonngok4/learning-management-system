import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData, updateProfile } from "../../Redux/Slices/AuthSlice";

function EditProfile() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [data, setData] = useState({
        previewImage: "",
        firstName: "",
        lastName: "",
        avatar: undefined,
        userId: useSelector((state) => state?.auth?.data?._id)
    });

    function handleImageUpload(e) {
        e.preventDefault();
        const uploadedImage = e.target.files[0];
        if (uploadedImage) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setData({
                    ...data,
                    previewImage: this.result,
                    avatar: uploadedImage
                })
            })
        }
    }

    function handleInputChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        })
    }

    async function onFormSubmit(e) {
        e.preventDefault();
        //    console.log(data)
        if (!data.firstName || !data.lastName || !data.avatar) {
            toast.error("All fields are mandatory");
            return;
        }

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("avatar", data.avatar);

        await dispatch(updateProfile(formData));

        await dispatch(getuserData());

        navigate("/user/profile");
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center h-[100vh]">
                <form
                    onSubmit={onFormSubmit}
                    className="flex flex-col justify-center items-center gap-5 shadow-[0_0_10px_black] p-4 rounded-lg w-80 min-h-[26rem] text-white"
                >
                    <h1 className="font-semibold text-2xl text-center">Edit Profile</h1>
                    <label
                        className="cursor-pointer"
                        htmlFor="image_uploads"
                    >
                        {data.previewImage ? (
                            <img
                                className="m-auto rounded-full w-28 h-28"
                                src={data.previewImage}

                            />
                        ) : (
                            <BsPersonCircle className="m-auto rounded-full w-28 h-28" />
                        )
                        }
                    </label>
                    <input
                        onChange={handleImageUpload}
                        className="hidden"
                        type="file"
                        id="image_uploads"
                        name="image_uploads"
                        accept=".jpg, .png, .svg,.jpeg"
                    />


                    <div className="gap-3 grid grid-cols-2">
                        <input
                            onChange={handleInputChange}
                            type="text"
                            placeholder="First name"
                            name="firstName"
                            className="border-white bg-transparent p-2 border rounded-sm"
                        />
                        <input
                            onChange={handleInputChange}
                            type="text"
                            placeholder="Last name"
                            name="lastName"
                            className="border-white bg-transparent p-2 border rounded-sm"
                        />
                    </div>
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 mt-2 py-2 rounded-sm w-full font-semibold text-lg transition-all duration-300 cursor-pointer ease-in-out">
                        Update Profile
                    </button>
                    <Link to="/user/profile">
                        <p className="flex justify-center items-center gap-3 w-full text-accent cursor-pointer link">
                            <AiOutlineArrowLeft />Go back to profile
                        </p>
                    </Link>

                </form>
            </div>
        </HomeLayout>
    )
}
export default EditProfile;