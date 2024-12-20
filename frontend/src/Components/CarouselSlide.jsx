import PropTypes from "prop-types";
function CarouselSlide({ image, title, description, slideNumber, totalSlides }) {
    return (
                <div id={`slide${slideNumber}`} className="relative w-full carousel-item">
                    <div className="flex flex-col justify-center items-center gap-4 px-[15%]">
                        <img src={image} className="border-2 border-gray-400 rounded-full w-40" />
                        <p className="text-gray-200 text-xl">
                            {description}
                        </p>
                        <h3 className="font-semibold text-2xl">{title}</h3>
                        <div className="top-1/2 right-0 sm:right-5 left-0 sm:left-5 absolute flex justify-between transform -translate-y-1/2">
                            <a href={`#slide${(slideNumber == 1 ? totalSlides : (slideNumber - 1))}`} className="btn btn-circle">❮</a> 
                            <a href={`#slide${(slideNumber) % totalSlides + 1}`} className="btn btn-circle">❯</a>
                        </div>
                    </div>
                    
                </div> 
    );
}

CarouselSlide.propTypes = {
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    slideNumber: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired
}

export default CarouselSlide;