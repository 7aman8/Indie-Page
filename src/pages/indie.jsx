import Profile from "/Profile.png";

import Mahali from "../assets/Logo/Mahali.png";

import PaymentsIcon from '@mui/icons-material/Payments';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

// Socials
import X from '@mui/icons-material/X';
import Github from '@mui/icons-material/Github';
import Instagram from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const startups = [
    {
        name: "Mahali",
        description: "A Talabat for home business owners! 🚚",
        link: "https://mahali.food",
        logo: Mahali 
    },
    // {
    //     name: "Startup 2",
    //     description: "This is a description for Startup 2",
    //     link: "https://startup2.com",
    //     logo: "/path/to/logo2.png"
    // }
];

//#EEEEEE is marc's lou bg

function Home(){

    return(
        <div className="flex flex-col sm:flex-row gap-10 text-[#2b2b28] bg-[#F2EFE7]/70 min-h-screen w-full overflow-x-hidden">

            {/* Main page with picture */}
            <div className=" sm:translate-x-20 sm:translate-y-20
            flex-col gap-0 ml-10
            ">

                <img src={Profile} alt="Profile Picture" 
                className="w-20 h-20 mt-5 sm:w-45 sm:h-45 rounded-full"
                />

                <h1 className="text-3xl italic font-[800] mt-5">Abdulrahman Janahi</h1>

                <div className="flex align-middle items-center flex-row gap-5 text-gray-600 font-bold
                mt-4
                ">
                    <span className="italic">
                        <FmdGoodIcon className="w-6 h-6 -translate-y-[1px]" /> Bahrain 🇧🇭
                    </span>

                    <span className="italic">
                        <PaymentsIcon className="w-6 h-6 mr-[2px]" /> $0/month
                    </span>
                </div>

                <div className="flex flex-col gap-2 mt-10">
                    <span className="text-lg text-gray-600 italic">
                        "Building products in public 🚀 | Developer"
                    </span>
                </div>

                {/* Socials */}
                <div className="flex flex-row gap-10 mt-8 text-gray-600">
                    <a href="https://x.com/Abdulrahma80860/" target="_blank" rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    >
                        <X className="w-10 h-10" sx={{ fontSize: 30 }} />
                    </a>
                    <a href="https://github.com/7aman8" target="_blank" rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    >
                        <Github className="w-10 h-10" sx={{ fontSize: 30 }} />
                    </a>
                    <a href="https://www.instagram.com/arj08._/" target="_blank" rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    >
                        <Instagram className="w-10 h-10" sx={{ fontSize: 30 }} />
                    </a>
                    <a href="https://www.linkedin.com/in/arj11/" target="_blank" rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    >
                        <LinkedInIcon className="w-10 h-10" sx={{ fontSize: 30 }} />
                    </a>
                </div>  

            </div>

            <hr className="block sm:hidden text-gray-400 mx-8 " />

            {/* StartUps Page */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 m-10 sm:translate-x-25 ">

                {startups.map((startup, index) => (
                    <a
                    key={index}
                    href={startup.link}
                    target="_blank"
                    className="group h-25 rounded-box cursor-pointer p-5 duration-200 hover:scale-[1.02] hover:bg-zinc-100 
                    shadow-sm bg-white rounded-2xl
                    "
                    >
                    {/* Logo and Name */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 lg:gap-x-4">
                        <img
                        src={startup.logo}
                        alt={`${startup.name} Logo`}
                        className="object-cover duration-200 delay-100 group-hover:-rotate-12 h-6 w-6 lg:h-8 lg:w-8"
                        />
                        <p className="mr-auto font-semibold lg:text-lg">{startup.name}</p>
                    </div>

                    {/* Description */}
                    <p className="text-zinc-700/80 mt-2 text-sm lg:text-base">{startup.description}</p>
                    </a>
                ))}
            </div>
        
        </div>
    )
}

export default Home;
