import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
function CourseCard({ data }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate("/course/description/", { state: { ...data } })}
            className="shadow-lg rounded w-[20rem] h-[400px] text-white cursor-pointer overflow-hidden group">
            <div className="overflow-hidden">
                <img
                    className="group-hover:scale=[1,2] rounded-tl-lg rounded-tr-lg w-full h-48 transition-all duration-300 ease-in-out"
                    src={data?.coverImage}
                    alt="course thumbnail"
                />
                <div className="space-y-1 p-5 text-white">
                    <h2 className="line-clamp-2 font-bold text-xl text-yellow-500">
                        {data?.title}
                    </h2>
                    <p className="line-clamp-2">
                        {data?.description}
                    </p>
                    <p className="font-semibold">
                        <span className="font-bold text-yellow-500">Category: </span>
                        {data?.category}
                    </p>
                    {/* <p className="font-semibold">
                        <span className="font-bold text-yellow-500">Total lectures :</span>
                        {data?.numberoflectures}
                    </p> */}
                    <p className="font-semibold">
                        <span className="font-bold text-yellow-500">Instructor: </span>
                        {`${data?.instructor?.firstName} ${data?.instructor?.lastName}`}
                    </p>
                </div>
            </div>
        </div>
    );

}

CourseCard.propTypes = {
    data: PropTypes.object.isRequired,
};
export default CourseCard;