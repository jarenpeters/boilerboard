import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../Components/SearchBar.jsx";
import ClubCard from "../Components/ClubCard.jsx";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Search() {
    const queryParam = useQuery().get("query") || "";
    const filterParam = useQuery().get("filter") || "";
    const tagParam = useQuery().get("tag") || "";

    const [results, setResults] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(20);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1280);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch all events once
    useEffect(() => {
        fetch("https://boilerboard.onrender.com/events")
            .then((res) => res.json())
            .then((data) => {
                setAllEvents(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Sort by date descending
    const sortByDate = (arr) =>
        arr.sort((a, b) => {
            if (!a.DateISO) return 1;
            if (!b.DateISO) return -1;
            return new Date(b.DateISO) - new Date(a.DateISO);
        });

    // Re-filter events whenever params or events change
    useEffect(() => {
        if (loading) return;
        setVisibleCount(20); // reset pagination

        let filtered = [];

        // -----------------------
        // Exact username search
        // -----------------------
        if (queryParam.startsWith("@")) {
            const usernameQuery = queryParam.slice(1).toLowerCase();
            filtered = allEvents.filter(
                (event) => event.Username?.toLowerCase() === usernameQuery
            );
        }
            // -----------------------
            // Text search (including tags)
        // -----------------------
        else if (queryParam) {
            const q = queryParam.toLowerCase();
            filtered = allEvents.filter((event) => {
                const title = event.EventTitle?.toLowerCase() || "";
                const user = event.Username?.toLowerCase() || "";
                const summary = event.EventSummary?.toLowerCase() || "";
                const tags = event.Tags?.map((t) => t.toLowerCase()) || [];

                return (
                    title.includes(q) ||
                    user.includes(q) ||
                    summary.includes(q) ||
                    tags.some((t) => t.includes(q))
                );
            });
        }
            // -----------------------
            // Tag filter
        // -----------------------
        else if (tagParam) {
            const tagLower = tagParam.toLowerCase();
            filtered = allEvents.filter((event) =>
                event.Tags?.map((t) => t.toLowerCase()).includes(tagLower)
            );
        }
            // -----------------------
            // This week filter
        // -----------------------
        else if (filterParam === "thisweek") {
            const today = new Date();
            const start = new Date(today);
            start.setDate(today.getDate() - today.getDay() + 1);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);

            filtered = allEvents.filter((event) => {
                if (!event.DateISO || event.DateISO === "NOT_FOUND") return false;
                const d = new Date(event.DateISO);
                return d >= start && d <= end;
            });
        }
            // -----------------------
            // All events
        // -----------------------
        else if (filterParam === "all") {
            filtered = [...allEvents];
        }

        setResults(sortByDate(filtered));
    }, [queryParam, filterParam, tagParam, allEvents, loading]);

    // Determine display message
    const searchEmpty = !queryParam && !tagParam && !filterParam;
    const noResults = !searchEmpty && results.length === 0;

    return (
        <div className="text-boilerbeige p-6">
            {isMobile && (
                <div className="flex justify-center -mt-8">
                    <SearchBar
                        className="mb-6 w-140 sm:w-140 lg:w-180"
                        placeholder="search..."
                    />
                </div>
            )}

            {searchEmpty ? (
                <p className="text-center text-4xl font-dmsans font-black text-gray-300 whitespace-normal overflow-hidden">
                    please enter a search
                </p>
            ) : noResults ? (
                <p className="text-center text-4xl font-dmsans font-black text-gray-300 whitespace-normal overflow-hidden">
                    no events found for "{queryParam || tagParam || filterParam}"
                </p>
            ) : (
                <>
                    <div className="relative flex flex-wrap pl-13 mx-auto gap-6">
                        {results.slice(0, visibleCount).map((event, index) => (
                            <ClubCard
                                key={index}
                                username={event.Username}
                                title={event.EventTitle}
                                date={event.Date}
                                time={event.Time}
                                location={event.Location}
                                summary={event.EventSummary}
                                image={event.ImageURL}
                                instagram={event.InstagramURL}
                            />
                        ))}
                    </div>

                    {visibleCount < results.length && (
                        <div className="flex justify-center w-full mt-10">
                            <button
                                onClick={() => setVisibleCount(visibleCount + 20)}
                                className="px-6 py-3 rounded-4xl shadow-lg border border-white/10
                                           backdrop-blur-lg bg-boilerdark/40 text-boilerbeige font-bold
                                           hover:bg-white/20 transition -mt-3"
                            >
                                load more
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}