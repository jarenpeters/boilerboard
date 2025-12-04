import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import SearchBar from "./SearchBar.jsx";

function NavBar() {
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = 500; // adjust to your hero height
            if (window.scrollY > heroHeight) setShowSearch(true);
            else setShowSearch(false);
        };

        // only attach scroll listener if not on search page
        if (location.pathname === "/") {
            window.addEventListener("scroll", handleScroll);
            handleScroll(); // initialize state in case already scrolled
        } else {
            setShowSearch(true); // always show search bar on search page
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
        <nav className="sticky top-10 z-50 h-22 sm:h-26 flex flex-col sm:flex-row items-center shadow-lg border border-white/10 justify-between backdrop-blur-lg bg-boilerdark/40 text-white px-6 sm:px-10 py-4 sm:py-6 m-4 sm:m-10 rounded-full font-dmsans font-black gap-4 sm:gap-0 transition-all duration-300">

            {/* Logo */}
            <Link to="/">
                <div className="flex items-center gap-2 sm:gap-0">
                    <img className="rounded-2xl h-16 max-h-[60%] object-contain" src="/secondlogo.png" />
                    <div className="text-3xl sm:text-5xl font-extrabold font-stick-no-bills pt-[7px]">
                        boilerboard
                    </div>
                </div>
            </Link>

            {/* Search bar */}
            <div className={`pl-8 flex-1 flex justify-center transition-all duration-300 ${showSearch ? "opacity-100 max-w-[600px]" : "opacity-0 max-w-0"}`}>
                <SearchBar ref={searchInputRef} className="w-full" />
            </div>

            {/* Navigation links */}
            <div className="flex gap-6 sm:gap-1 text-lg sm:text-xl items-center">
                <Link to="/" className="hover:text-boilerbeige/90 relative z-10 inline-block px-4 py-2 transform transition-transform duration-200 ease-out hover:-translate-y-[3px]">
                    home
                </Link>
                <Link to="/calendar" className="hover:text-boilerbeige/90 relative z-10 inline-block px-4 py-2 transform transition-transform duration-200 ease-out hover:-translate-y-[3px]">calendar</Link>
                <Link to="/about" className="hover:text-boilerbeige/90 relative z-10 inline-block px-4 py-2 transform transition-transform duration-200 ease-out hover:-translate-y-[3px]">about</Link>
            </div>
        </nav>
    );
}

export default NavBar;
