import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ClubCard from "../Components/ClubCard.jsx";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Search() {
    const queryParam = useQuery().get("query") || "";
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!queryParam) return;
        window.scrollTo(0, 0);

        fetch(`http://127.0.0.1:5000/search?query=${encodeURIComponent(queryParam)}`)
            .then((res) => res.json())
            .then((data) => setResults(data))
            .catch((err) => console.error(err));
    }, [queryParam]);


    return (
        <div className="text-white p-6">
            {results.length === 0 ? (
                <p className="text-center text-4xl font-dmsans font-black text-gray-300 whitespace-normal overflow-hidden">no events found for "{queryParam}".</p>
            ) : (
                <div className="relative flex flex-wrap pl-19 gap-6">
                    {results.map((event, index) => (
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
            )}
        </div>
    );
}
