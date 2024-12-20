import { useState } from "react";
import { toast } from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Login() {

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [loginData, setloginData] = useState({
        email: "",
        password: "",
    });

    function handleUserInput(e) {
        const { name, value } = e.target;
        setloginData({
            ...loginData,
            [name]: value
        })
    }

    async function onLogin(event) {
        event.preventDefault();
        if (!loginData.email || !loginData.password) {
            toast.error("Please fill all the details ");
            return;
        }


        //dispatch create account action
        const response = await dispatch(login(loginData));
        if (response?.payload?.success) {
            navigate("/");
            setloginData({
                email: "",
                password: "",
            })
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center h-[90vh]">
                <form noValidate onSubmit={onLogin} className="flex flex-col justify-center gap-3 shadow-[0_0_10px_black] p-4 rounded-lg w-80 text-white">
                    <h1 className="font-bold text-2xl text-center">Login Page</h1>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="font-semibold">Email</label>
                        <input
                            type="email"
                            required
                            name="email"
                            id="email"
                            placeholder="Enter your email...."
                            className="bg-transparent px-2 py-1 border"
                            onChange={handleUserInput}
                            value={loginData.email}
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
                            className="bg-transparent px-2 py-1 border"
                            onChange={handleUserInput}
                            value={loginData.password}
                        />
                    </div>

                    <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 mt-2 py-2 rounded-sm font-semibold text-lg transition-all duration-300 cursor-pointer ease-in-out">
                        Login
                    </button>

                    <Link to={"/forget-password"}>
                        <p className="text-accent text-center cursor-pointer link">
                            Forget Password
                        </p>
                    </Link>

                    <p className="text-center">
                        Donot have an account ? <Link to="/signup" className="text-accent cursor-pointer link">Signup</Link>
                    </p>

                </form>
            </div>
        </HomeLayout>
    )
}
export default Login;