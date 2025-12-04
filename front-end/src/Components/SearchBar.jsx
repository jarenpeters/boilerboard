import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar({ placeholder = "search...", className = "" }) {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Pull query from URL and sync search bar value
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlQuery = params.get("query") || "";
        setQuery(urlQuery);
    }, [location.search]);

    const handleSearch = () => {
        if (query.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div
            className={`flex items-center bg-boilerbeige/20 backdrop-blur-md border border-boilerbeige/20 rounded-full overflow-hidden ${className}`}
        >
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-3 text-boilerbeige placeholder-boilerbeige/50 font-dmsans font-black focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
                onClick={handleSearch}
                className="flex items-center justify-center w-16 h-12 border border-boilerbeige/20 backdrop-blur-md bg-boilergold/80 text-boilerdark rounded-full hover:bg-boilergold/60"
            >
                <img alt="search" src="/searchicon.png" className="w-5 h-5" />
            </button>
        </div>
    );
}

export default SearchBar;
