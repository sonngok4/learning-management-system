import aboutMainImage from "../Assets/Images/aboutMainImage.png";
import CarouselSlide from "../Components/CarouselSlide";
import { celebrities } from "../Constants/CelebrityData";
import HomeLayout from "../Layouts/HomeLayout";

function AboutUs(){

    return (
        <HomeLayout>
            <div className="flex flex-col pt-20 lg:pl-20 min-h-[90vh] text-white">
                <div className="flex lg:flex-row flex-col items-center gap-5 mx-10">
                    <section className="space-y-10 lg:w-1/2">
                        <h1 className="font-semibold text-5xl text-yellow-500">
                            Affordable and quality education 
                        </h1>
                        <p className="text-gray-200 text-xl">
                                Our goal is to provide afoordable quality education to the world ,
                                we are providing the platform for the aspiring teachers and students to share 
                                their skills , creativity and knowledge to each other to empower and contribute 
                                in the growth and wellness of mankind.
                        </p>
                    </section>
                    <div className="lg:w-1/2">
                        <img
                            id="test1"
                            style={{
                                filter: "drop-shadow(0px 10px 10px rgb(0,0,0));"
                            }}
                            alt="about main image"
                            className="drop-shadow-2xl"
                            src={aboutMainImage}
                        />
                    </div>
                </div>

                <div className="m-auto my-16 w-[80vw] lg:w-1/2 carousel">
                    {celebrities && celebrities.map(celebrity => (<CarouselSlide 
                                                                    {...celebrity} 
                                                                    key={celebrity.slideNumber} 
                                                                    totalSlides={celebrities.length}
                                                                    
                                                                />))}
                </div>
            </div>
        </HomeLayout>
    )
}
export default AboutUs;