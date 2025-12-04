import React from "react"
import ClubCard from "../Components/ClubCard.jsx";
import Landing from "../Components/Landing.jsx";
import EventsList from "../Components/EventsList.jsx";

export default function HomePage() {
    return (
        <div className="text-white">
            <div className="relative flex flex-col">
                <Landing />

                {/* Events section with horizontal carousels handled inside EventsList */}
                <div className="mt-10">
                    <EventsList />
                </div>
                <div className="flex flex-wrap justify-center gap-6">
                </div>
            </div>
        </div>
    );
}






