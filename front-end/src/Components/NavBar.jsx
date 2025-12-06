import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchBar from "./SearchBar.jsx";

function NavBar() {
    const location = useLocation();
    const [showSearch, setShowSearch] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const heroHeight = 500;
            if (window.scrollY > heroHeight) setShowSearch(true);
            else setShowSearch(false);
        };

        if (location.pathname === "/") {
            window.addEventListener("scroll", handleScroll);
            handleScroll();
        } else {
            setShowSearch(true);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    return (
        <div className="sticky top-10 z-50 relative">
            <nav
                className="
                    flex items-center justify-between
                    shadow-lg border border-white/10
                    backdrop-blur-lg bg-boilerdark/40 text-white
                    font-dmsans font-black
                    rounded-full transition-all duration-300
                    px-10 mx-7
                    h-22 sm:h-26 sm:mx-10 my-8 sm:my-10
                "
            >
                {/* LEFT — LOGO */}
                <Link to="/" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center sm:gap-0">
                        <img
                            className="rounded-2xl h-12 sm:h-16 object-contain"
                            src="/secondlogo.png"
                        />
                        <div className="text-3xl sm:text-5xl font-stick-no-bills pt-[7px]">
                            boilerboard
                        </div>
                    </div>
                </Link>

                {/* CENTER — DESKTOP SEARCH BAR */}
                <div
                    className={`
                        hidden xl:flex flex-1 justify-center pl-8
                        transition-all duration-300
                        ${showSearch && !isOpen ? "opacity-100 max-w-[600px]" : "opacity-0 max-w-0"}
                    `}
                >
                    <SearchBar className="w-full" />
                </div>

                {/* RIGHT — MOBILE MENU BUTTON */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="xl:hidden relative flex items-center justify-center w-16 h-12 border border-boilerbeige/20 backdrop-blur-md bg-boilergold/80 rounded-full hover:bg-boilergold/60"
                >
                    {/* Hamburger Icon */}
                    <img
                        src="/hamburger.png"
                        alt="menu"
                        className={`absolute w-7 h-7 transition-transform duration-300 ${
                            isOpen ? "rotate-45 opacity-0" : "rotate-0 opacity-100"
                        }`}
                    />
                    {/* X Icon */}
                    <img
                        src="/exitham.png"
                        alt="close"
                        className={`absolute w-7 h-7 transition-transform duration-300 ${
                            isOpen ? "rotate-0 opacity-100" : "-rotate-45 opacity-0"
                        }`}
                    />
                </button>



                {/* RIGHT — DESKTOP NAV LINKS */}
                <div className="hidden xl:flex gap-6 sm:gap-1 text-lg sm:text-xl items-center">
                    <Link to="/" className="hover:text-boilerbeige/90 px-4 py-2">home</Link>
                    <Link to="/calendar" className="hover:text-boilerbeige/90 px-4 py-2">calendar</Link>
                    <Link to="/about" className="hover:text-boilerbeige/90 px-4 py-2">about</Link>
                </div>
            </nav>

            {/* MOBILE DROPDOWN — ABSOLUTE POSITIONED, DOESN'T PUSH CONTENT */}
            {isOpen && (
                <nav
                    className="
                        absolute top-full right-18 sm:right-30 mt-0
                        w-64 shadow-lg border border-t-0 border-white/10
                        backdrop-blur-lg bg-boilerdark/40 p-4 flex flex-col gap-4
                        rounded-b-2xl z-40 xl:hidden font-dmsans font-black
                    "
                >
                    {/* 🔍 MOBILE SEARCH BAR */}
                    <div className="w-full">
                        <SearchBar className="w-full" />
                    </div>

                    {/* LINKS */}
                    <Link to="/" className="text-xl text-boilerbeige py-2 px-2 rounded-lg hover:bg-white/10" onClick={() => setIsOpen(false)}>home</Link>
                    <Link to="/calendar" className="text-xl text-boilerbeige py-2 px-2 rounded-lg hover:bg-white/10" onClick={() => setIsOpen(false)}>calendar</Link>
                    <Link to="/about" className="text-xl text-boilerbeige py-2 px-2 rounded-lg hover:bg-white/10" onClick={() => setIsOpen(false)}>about</Link>
                </nav>
            )}
        </div>
    );
}

export default NavBar;