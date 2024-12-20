
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../../Layouts/HomeLayout";
import { getuserData } from "../../Redux/Slices/AuthSlice";
import { cancelCourseBundle } from "../../Redux/Slices/RazorpaySlice";

function Profile() {

    const userData = useSelector((state) => state?.auth?.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    async function handleCancelation() {
        if (window.confirm("Are you Sure Want  Cancel Subscription ?")) {
            toast("Initiating cancellation..")
            await dispatch(cancelCourseBundle());
            await dispatch(getuserData());
            toast.success("Cancellation completed!");
            navigate("/")
        }
    }
    return (
        <HomeLayout>
            <div className="flex justify-center items-center min-h-[90vh]">
                <div className="flex flex-col gap-4 shadow-[0_0_10px_black] my-10 p-4 rounded-lg w-[80vw] sm:w-96 text-white">
                    <img
                        className="m-auto border border-black rounded-full w-40"
                        src={userData?.avatar}
                    />

                    <h3 className="font-semibold text-center text-xl capitalize">
                        {userData?.firstName} {userData?.lastName}
                    </h3>
                    <div className="grid grid-cols-2">
                        <p>Email: </p><p>{userData?.email}</p>
                        <p>Role: </p><p>{userData?.role}</p>
                        <p>Subscription: </p><p>{userData?.subscription?.status === "active" ? "Active" : "Inactive"}</p>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                        <Link
                            to='/change-password'
                            className="bg-yellow-600 hover:bg-yellow-500 py-2 rounded-md w-1/2 font-semibold text-center transition-all duration-300 cursor-pointer ease-in-out" >
                            <button>Change password</button>
                        </Link>

                        <Link
                            to='/user/editprofile'
                            className="bg-yellow-600 hover:bg-yellow-500 py-2 rounded-md w-1/2 font-semibold text-center transition-all duration-300 cursor-pointer ease-in-out" >
                            <button>Edit Profile</button>
                        </Link>
                    </div>
                    {userData?.subscription?.status === 'active' && (
                        <button onClick={handleCancelation} className="bg-red-600 hover:bg-red-500 py-2 rounded-sm w-full font-semibold transition-all duration-300 cursor-pointer ease-in-out">
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </div>
        </HomeLayout>

    );
}
export default Profile;