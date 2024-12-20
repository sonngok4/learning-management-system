import { ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import { BsCollectionPlayFill, BsTrash } from 'react-icons/bs';
import { FaUsers } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { GiMoneyStack } from "react-icons/gi";
import { TiEdit } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import HomeLayout from "../../Layouts/HomeLayout";
import { deleteCourse, getAllCourse } from '../../Redux/Slices/CourseSlice';
import { getPaymentRecord } from '../../Redux/Slices/RazorpaySlice';
import { getStatsData } from '../../Redux/Slices/StatSlice';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function AdminDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { allUsersCount, subscribedCount } = useSelector((state) => state.stat);

    const { allPayments, monthlySalesRecord } = useSelector((state) => state.razorpay);


    const userData = {
        labels: ["Registered User", "Enrolled User"],
        datasets: [
            {
                label: "User Details",
                data: [allUsersCount, subscribedCount],
                backgroundColor: ["yellow", "green"],
                borderWidth: 1,
                borderColor: ["yellow", "green"]
            }
        ]
    }

    const salesData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        fontColor: "white",
        datasets: [
            {
                label: "Sales/Month",
                data: monthlySalesRecord,
                backgroundColor: ["red"],
            }
        ]
    }

    const myCoures = useSelector((state) => state?.course?.courseData);

    async function onCourseDelete(id) {
        if (window.confirm("Are you Sure Want to delete the course ?")) {
            const res = await dispatch(deleteCourse(id));
            if (res?.paylaod?.success) {
                await dispatch(getAllCourse())
            }
        }
    }

    useEffect(() => {
        (
            async () => {
                await dispatch(getAllCourse());
                await dispatch(getStatsData());
                await dispatch(getPaymentRecord());
            }
        )()

    }, [])

    return (
        <HomeLayout>
            <div className="flex flex-col flex-wrap gap-10 pt-5 min-h-[90vh] text-white">
                <h1 className="font-semibold text-3xl text-center text-yellow-500 sm:text-5xl">
                    Admin Dashboard
                </h1>

                <div className="gap-5 grid md:grid-cols-2 m-auto md:mx-10">
                    <div className="flex flex-col items-center gap-10 shadow-lg p-5 rounded-md">
                        <div className="w-80 h-80">
                            <Pie data={userData} />
                        </div>

                        <div className="gap-5 grid grid-cols-2">
                            <div className="flex justify-between items-center gap-5 shadow-md p-5 rounded-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold">Registered Users</p>
                                    <h3 className="font-bold text-4xl">{allUsersCount}</h3>
                                </div>
                                <FaUsers className="text-5xl text-yellow-500" />
                            </div>
                            <div className="flex justify-between items-center gap-5 shadow-md p-5 rounded-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold">Subscribed Users</p>
                                    <h3 className="font-bold text-4xl">{subscribedCount}</h3>
                                </div>
                                <FaUsers className="text-5xl text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-10 shadow-lg p-5 rounded-md">
                        <div className="relative w-full h-80">
                            <Bar className="bottom-0 absolute w-full h-80" data={salesData} />
                        </div>

                        <div className="gap-5 grid grid-cols-2">
                            <div className="flex justify-between items-center gap-5 shadow-md p-5 rounded-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold">Subscription Count</p>
                                    <h3 className="font-bold text-4xl">{allPayments?.count}</h3>
                                </div>
                                <FcSalesPerformance className="text-5xl text-yellow-500" />
                            </div>
                            <div className="flex justify-between items-center gap-5 shadow-md p-5 rounded-md">
                                <div className="flex flex-col items-center">
                                    <p className="font-semibold">Total Revenue</p>
                                    <h3 className="font-bold text-4xl">{allPayments?.count * 499}</h3>
                                </div>
                                <GiMoneyStack className="text-5xl text-green-500" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center gap-10 lg:mx-[10%] mb-10 w-[80%] self-center">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="font-semibold text-2xl text-center sm:text-3xl">
                            Courses overview
                        </h1>
                        <button
                            onClick={() => {
                                navigate("/course/create");
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 px-2 sm:px-4 py-2 rounded w-fit font-semibold sm:text-lg transition-all duration-300 cursor-pointer ease-in-out"
                        >
                            Create new course
                        </button>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Course Title</th>
                                    <th>Course Category</th>
                                    <th>Instructor</th>
                                    <th>Total Lectures</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myCoures?.map((course, idx) => {
                                    return (
                                        <tr key={course._id}>
                                            <td>{idx + 1}</td>
                                            <td>
                                                <textarea
                                                    readOnly
                                                    value={course?.title}
                                                    className="bg-transparent w-full lg:w-40 h-auto resize-none"
                                                >
                                                </textarea>
                                            </td>
                                            <td>{course?.category}</td>
                                            <td>{course?.createdBy}</td>
                                            <td>{course?.numberOfLectures}</td>
                                            <td className="max-w-28 text-ellipsis whitespace-nowrap overflow-hidden">
                                                <textarea
                                                    value={course?.description}
                                                    readOnly
                                                    className="bg-transparent w-full lg:w-80 h-auto resize-none"
                                                ></textarea>
                                            </td>
                                            <td className="flex items-center gap-4">

                                                <button
                                                    className="bg-green-500 hover:bg-green-600 px-3 py-2 rounded-md font-bold text-xl transition-all duration-300 ease-in-out"
                                                    onClick={() =>
                                                        navigate("/course/displaylecture", {
                                                            state: { ...course },
                                                        })
                                                    }
                                                >
                                                    <BsCollectionPlayFill />
                                                </button>

                                                <button
                                                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-md font-bold text-xl transition-all duration-300 ease-in-out"
                                                    onClick={() =>
                                                        navigate("/course/edit", {
                                                            state: {
                                                                ...course
                                                            }
                                                        })}
                                                >
                                                    <TiEdit />
                                                </button>

                                                <button
                                                    className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md font-bold text-xl transition-all duration-300 ease-in-out"
                                                    onClick={() => onCourseDelete(course?._id)}
                                                >
                                                    <BsTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>

            </div>
        </HomeLayout>
    )
}
export default AdminDashboard;