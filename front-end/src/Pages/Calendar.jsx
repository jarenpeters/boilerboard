import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("https://boilerboard.onrender.com/events")
            .then((res) => res.json())
            .then((data) => {
                const formatted = data
                    .filter((post) => post.DateISO && post.DateISO !== "NOT_FOUND")
                    .map((post) => {
                        const startTime = post.Time && post.Time !== "NOT_FOUND" ? post.Time : "12:00PM";
                        const [hour, minutePart, ampm] = startTime.match(/(\d+):?(\d+)?(AM|PM)/i).slice(1, 4);
                        let hour24 = parseInt(hour);
                        if (/PM/i.test(ampm) && hour24 !== 12) hour24 += 12;
                        if (/AM/i.test(ampm) && hour24 === 12) hour24 = 0;
                        const minute = minutePart ? parseInt(minutePart) : 0;

                        const start = new Date(post.DateISO);
                        start.setHours(hour24, minute);

                        const end = new Date(start);
                        end.setHours(end.getHours() + 1);

                        return {
                            title: post.EventTitle,
                            start: start.toISOString(),
                            end: end.toISOString(),
                            extendedProps: {
                                description: post.EventSummary,
                                location: post.Location,
                                image: post.ImageURL,
                                instagram: post.InstagramURL
                            }
                        };
                    });
                setEvents(formatted);
            });
    }, []);

    return (
        <div className="px-30 font-dmsans font-black">
            <div className="p-12 min-h-screen bg-boilerdark/60 backdrop-blur-lg rounded-[80px] shadow-xl text-white">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    buttonClassNames="rounded-full bg-boilerdark text-white font-bold px-4 py-2 hover:bg-white/20 hover:text-boilerbeige"
                    events={events}
                    eventClick={(info) => {
                        window.open(info.event.extendedProps.instagram, "_blank");
                    }}
                    dayCellClassNames="rounded-xl hover:bg-white/10 transition-colors"
                    eventClassNames="bg-white/20 text-white border border-white/30 rounded-xl p-1"
                />
            </div>
        </div>
    );
}
