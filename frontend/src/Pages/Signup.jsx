import { useState } from "react";
import { toast } from 'react-hot-toast'
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { isEmail, isPassword } from "../Helpers/regexMatcher";
import HomeLayout from "../Layouts/HomeLayout";
import { creatAccount } from "../Redux/Slices/AuthSlice";

function Signup() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [prevImage, setPrevImage] = useState("");

    const [signupData, setSignupData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        avatar: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        })
    }

    function getImage(event) {
        event.preventDefault();

        //getting image
        const uploadedImage = event.target.files[0];

        if (uploadedImage) {
            setSignupData({
                ...signupData,
                avatar: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                console.log(this.result);
                setPrevImage(this.result);
            })
        }
    }

    async function createNewAccount(event) {
        event.preventDefault();
        if (!signupData.email || !signupData.firstName || !signupData.lastName || !signupData.password) {
            toast.error("Please fill all the details ");
            return;
        }

        //checking name filed 
        if (!signupData.firstName) {
            toast.error("Please enter your name");
            return;
        }

        if (!signupData.lastName) {
            toast.error("Please enter your last name");
            return;
        }

        //email vaildtaion 
        if (!isEmail(signupData.email)) {
            toast.error("Invaild email id  ")
            return;
        }

        //checking password
        // Password regex validation for different conditions
        const password = signupData.password;

        // Check if password has at least 8 characters
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        // Check if password contains at least one lowercase letter
        if (!/[a-z]/.test(password)) {
            toast.error("Password must contain at least one lowercase letter.");
            return;
        }

        // Check if password contains at least one uppercase letter
        if (!/[A-Z]/.test(password)) {
            toast.error("Password must contain at least one uppercase letter.");
            return;
        }

        // Check if password contains at least one digit
        if (!/\d/.test(password)) {
            toast.error("Password must contain at least one digit.");
            return;
        }

        // Check if password contains at least one special character
        if (!/[!@#$%^&*()_+={}|;:,.<>?`~\-\[\]\/]/.test(password)) {
            toast.error("Password must contain at least one special character.");
            return;
        }
        
        const formData = new FormData();
        formData.append("firstName", signupData.firstName);
        formData.append("lastName", signupData.lastName);
        formData.append("username", signupData.username);
        formData.append("email", signupData.email);
        formData.append("password", signupData.password);
        formData.append("avatar", signupData.avatar);


        //dispatch create account action
        const response = await dispatch(creatAccount(formData));
        if (response?.payload?.success) {
            navigate("/");
            setSignupData({
                firstName: "",
                lastName: "",
                username: "",
                email: "",
                password: "",
                avatar: "",
            })
            setPrevImage("");
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center h-[90vh]">
                <form noValidate onSubmit={createNewAccount} className="flex flex-col justify-center gap-3 shadow-[0_0_10px_black] p-4 rounded-lg w-80 text-white">
                    <h1 className="font-bold text-2xl text-center">Registration</h1>
                    <label htmlFor="image_uploads" className="cursor-pointer">
                        {prevImage ? (
                            < img className="m-auto rounded-full w-24 h-24" src={prevImage} />
                        ) : (
                            <BsPersonCircle className="m-auto rounded-full w-24 h-24" />
                        )}
                    </label>
                    <input
                        className="hidden"
                        type="file"
                        name="image_uploads"
                        id="image_uploads"
                        accept=".jpg, .jpeg , .png ,.svg"
                        onChange={getImage}
                    />

                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="col-span-1">
                            <label htmlFor="firstName" className="font-semibold">First Name</label>
                            <input
                                type="text"
                                required
                                name="firstName"
                                id="firstName"
                                placeholder="First Name"
                                className="bg-transparent py-1 w-full"
                                onChange={handleUserInput}
                                value={signupData.firstName}
                            />
                        </div>
                        <div className="col-span-1">
                            <label htmlFor="lastName" className="font-semibold">Last Name</label>
                            <input
                                type="text"
                                required
                                name="lastName"
                                id="lastName"
                                placeholder="Last Name"
                                className="bg-transparent py-1 w-full"
                                onChange={handleUserInput}
                                value={signupData.lastName}
                            />
                        </div>
                    </div>

                    <div className="bg-gray-400 w-full h-[1px]"></div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="font-semibold">Username</label>
                        <input
                            type="text"
                            required
                            name="username"
                            id="username"
                            placeholder="Enter your username...."
                            className="bg-transparent py-1"
                            onChange={handleUserInput}
                            value={signupData.username}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input
                            type="email"
                            required
                            name="email"
                            id="email"
                            placeholder="Enter your email...."
                            className="bg-transparent py-1"
                            onChange={handleUserInput}
                            value={signupData.email}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="font-semibold">Password</label>
                        <input
                            type="password"
                            required
                            name="password"
                            id="password"
                            placeholder="Enter your password...."
                            className="bg-transparent py-1"
                            onChange={handleUserInput}
                            value={signupData.password}
                        />
                    </div>
                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 mt-2 py-2 rounded-sm font-semibold text-lg transition-all duration-300 cursor-pointer ease-in-out">
                        Create Account
                    </button>
                    <p className="text-center">
                        Already have an account ? <Link to="/login" className="text-accent cursor-pointer link">Login</Link>
                    </p>

                </form>
            </div>
        </HomeLayout>
    )
}
export default Signup;