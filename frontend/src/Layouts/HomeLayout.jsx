import { AiFillCloseCircle } from 'react-icons/ai';
import { FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import Footer from '../Components/Footer.jsx';
import { logout } from '../Redux/Slices/AuthSlice.js';

function HomeLayout({ children }) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    //for checking if user is logged in 
    const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);

    // for displaying the options acc to role
    const role = useSelector((state) => state?.auth?.role);


    function changeWidth() {
        const drawerSide = document.getElementsByClassName("drawer-side");
        drawerSide[0].style.width = 'auto';
    }

    function hideDrawer() {
        const element = document.getElementsByClassName("drawer-toggle");
        element[0].checked = false;

        const drawerSide = document.getElementsByClassName("drawer-side");
        drawerSide[0].style.width = '0';
    }

    async function handleLogout(e) {
        e.preventDefault();

        const res = await dispatch(logout());
        if (res?.payload?.sucess) { navigate("/"); }

    }

    return (
        <div className="min-h-[90vh]" >
            <div className="left-0 z-50 absolute w-fit drawer">
                <input className="drawer-toggle" id="my-drawer" type="checkbox" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer" className="relative cursor-pointer">
                        <FiMenu
                            onClick={changeWidth}
                            size={"32px"}
                            className="m-4 font-bold text-white"
                        />
                    </label>
                </div>
                <div className="w-0 drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay">
                    </label>
                    <ul className="relative bg-base-200 p-4 w-48 sm:w-80 h-[100%] text-base-content menu">
                        <li className="right-2 z-50 absolute w-fit">
                            <button onClick={hideDrawer}>
                                <AiFillCloseCircle size={24} />
                            </button>
                        </li>
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        {isLoggedIn && role == 'admin' && (
                            <li>
                                <Link to="/admin/dashboard">Admin Dashboard</Link>
                            </li>
                        )}
                        {isLoggedIn && (role === 'admin' || role === 'instructor') && (
                            <li>
                                <Link to="/course/create"> Create new course</Link>
                            </li>
                        )}
                        <li>
                            <Link to="/courses">All Courses</Link>
                        </li>
                        {isLoggedIn && (role === 'student' || role === 'instructor') && (
                            <li>
                                <Link to="/courses/my-courses">My Courses</Link>
                            </li>
                        )}

                        <li>
                            <Link to="/contact">Contact Us</Link>
                        </li>

                        <li>
                            <Link to="/about">About Us</Link>
                        </li>

                        {!isLoggedIn && (
                            <li className='bottom-4 absolute w-[90%]'>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <button className='bg-blue-500 px-3 py-2 rounded-md w-full font-semibold text-[1rem] btn-primary'>
                                        <Link to="/login">Login</Link>
                                    </button>
                                    <button className='bg-pink-600 px-3 py-2 rounded-md w-full font-semibold text-[1rem] btn-secondary'>
                                        <Link to="/signup">Signup</Link>
                                    </button>
                                </div>
                            </li>
                        )}

                        {isLoggedIn && (
                            <li className='bottom-4 absolute w-[90%]'>
                                <div className='flex flex-col justify-center items-center w-full'>
                                    <button className='bg-blue-500 px-3 py-2 rounded-md w-full font-semibold text-[1rem] btn-primary'>
                                        <Link to="/user/profile">Profile</Link>
                                    </button>
                                    <button className='bg-pink-600 px-3 py-2 rounded-md w-full font-semibold text-[1rem] btn-secondary'>
                                        <Link onClick={handleLogout}>Logout</Link>
                                    </button>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {children}

            <Footer />
        </div>
    );
}

export default HomeLayout;