import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function Calendar() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch("https://boilerboard.onrender.com/events")
            .then(res => res.json())
            .then(data => {
                const formatted = data
                    .filter(post => post.DateISO && post.DateISO !== "NOT_FOUND")
                    .map(post => {
                        const startTime = post.Time && post.Time !== "NOT_FOUND" ? post.Time : "12:00PM";

                        let startHour = 12;
                        let startMinute = 0;
                        const match = startTime.match(/(\d+):?(\d+)?\s*(AM|PM)/i);
                        if (match) {
                            let [_, h, m, ampm] = match;
                            startHour = parseInt(h);
                            startMinute = m ? parseInt(m) : 0;
                            if (/PM/i.test(ampm) && startHour !== 12) startHour += 12;
                            if (/AM/i.test(ampm) && startHour === 12) startHour = 0;
                        }

                        const start = new Date(post.DateISO); // make sure DateISO is YYYY-MM-DD
                        start.setHours(startHour, startMinute);

                        const end = new Date(start);
                        end.setHours(end.getHours() + 1);

                        return {
                            title: post.EventTitle,
                            start,
                            end,
                            extendedProps: {
                                description: post.EventSummary,
                                location: post.Location,
                                image: post.ImageURL,
                                instagram: post.InstagramURL
                            }
                        };
                    });
                setEvents(formatted);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="px-10 lg:px-30 font-dmsans font-black">
            <div className="p-12 min-h-screen bg-boilerdark/60 backdrop-blur-lg rounded-[20px] shadow-xl text-white">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay"
                    }}
                    buttonClassNames="rounded-full bg-boilerdark text-white font-bold px-4 py-2 hover:bg-white/20 hover:text-boilerbeige"
                    eventColor="orange"// lets the calendar grow based on content
                    contentHeight={400}
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
