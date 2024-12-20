import { useNavigate } from "react-router-dom";

function Denied() {
    const Navigate = useNavigate();
    return (
        <main className="flex flex-col justify-center items-center bg-[#1A2238] w-full h-screen">
            <h1 className="font-extrabold text-9xl text-white tracking-widest">
                403
            </h1>
            <div className="absolute bg-black px-2 rounded text-sm text-white rotate-12">
                Access denied
            </div>
            <button onClick={() => Navigate(-1)} className="mt-5">
                <span className="block relative bg-[#83773db6] px-8 py-3 border text-white">
                    Go Back
                </span>
            </button>
        </main>
    );
}
export default Denied;