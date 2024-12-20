import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"

import CourseCard from "../../Components/CourseCard";
import HomeLayout from "../../Layouts/HomeLayout";
import { getAllCourse } from "../../Redux/Slices/CourseSlice";

function CourseList() {

    const dispatch = useDispatch()
    const { courseData } = useSelector((state) => state.course);

    async function loadCourses() {
        await dispatch(getAllCourse());
    }
    useEffect(() => {
        loadCourses();
    }, []);
    return (
        <HomeLayout>
            <div className="flex flex-col gap-10 pt-12 min-h-[90vh] text-white">
                <h1 className="font-semibold text-3xl text-center">
                    Explore the course made by
                    <span className="font-bold text-yellow-500">
                        Industry experts
                    </span>
                </h1>
                <div className="gap-16 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto mb-10 text-center">
                    {courseData?.map((element) => {
                        return <CourseCard key={element._id} data={element} />
                    })}
                </div>

            </div>

        </HomeLayout>
    )
}
export default CourseList;