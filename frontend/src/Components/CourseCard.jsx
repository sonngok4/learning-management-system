// CourseCard.jsx
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function CourseCard({ data }) {
    const navigate = useNavigate();

    const handleCourseClick = () => {
        navigate("/course/description", {
            state: {
                _id: data?._id,
                name: data?.title, // Changed from title to name to match CourseDescription
                description: data?.description,
                category: data?.category,
                lessons: data?.lessons || [],
                instructor: data?.instructor,
                coverImage: data?.coverImage,
                price: data?.price,
                level: data?.level,
                tags: data?.tags || []
            }
        });
    };

    return (
        <div
            onClick={handleCourseClick}
            className="shadow-lg rounded w-[20rem] h-[400px] text-white cursor-pointer overflow-hidden group"
        >
            <div className="overflow-hidden">
                <img
                    className="group-hover:scale-110 rounded-tl-lg rounded-tr-lg w-full h-48 transition-all duration-300 ease-in-out"
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
                    <p className="font-semibold">
                        <span className="font-bold text-yellow-500">Total lectures: </span>
                        {data?.lessons?.length || 0}
                    </p>
                    <p className="font-semibold">
                        <span className="font-bold text-yellow-500">Instructor: </span>
                        {`${data?.instructor?.firstName || ''} ${data?.instructor?.lastName || ''}`}
                    </p>
                </div>
            </div>
        </div>
    );
}

CourseCard.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        category: PropTypes.string,
        lessons: PropTypes.array,
        instructor: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string
        }),
        coverImage: PropTypes.string,
        price: PropTypes.number,
        level: PropTypes.string,
        tags: PropTypes.arrayOf(PropTypes.string)
    }).isRequired
};

export default CourseCard;