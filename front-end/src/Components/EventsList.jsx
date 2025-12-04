import { useState, useEffect, useMemo } from "react";
import ClubCard from "./ClubCard";
import HorizontalCarousel from "./HorizontalCarousel";

function EventsList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/events")
            .then((res) => res.json())
            .then((data) => setPosts(data))
            .catch((err) => console.error(err));
    }, []);

    // Example: split posts into categories
    function filterByTag(tag) {
        return posts.filter(post => post.Tags && post.Tags.includes(tag));
    }

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => {
            if (!a.DateISO) return 1;
            if (!b.DateISO) return -1;
            return new Date(b.DateISO) - new Date(a.DateISO);
        });
    }, [posts]);

    const sortedByTag = (tag) => {
        return filterByTag(tag).sort((a, b) => {
            if (!a.DateISO) return 1;
            if (!b.DateISO) return -1;
            return new Date(b.DateISO) - new Date(a.DateISO);
        });
    };

    // Compute posts for this week (ignoring year in DateISO)
    const thisWeeksPosts = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday

        // Start of week (Monday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
        startOfWeek.setHours(0, 0, 0, 0); // set to start of day

        // End of week (Sunday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999); // set to end of day

        return posts.filter((post) => {
            if (!post.DateISO || post.DateISO === "NOT_FOUND") return false;
            const postDate = new Date(post.DateISO);
            return postDate >= startOfWeek && postDate <= endOfWeek;
        }).sort((a, b) => new Date(a.DateISO) - new Date(b.DateISO));
    }, [posts]);


    return (
        <div>
            <h2 className="text-2xl font-bold mb-2 pl-22">this week's events</h2>
            <HorizontalCarousel>
                {thisWeeksPosts.map((post) => (
                    <ClubCard
                        key={`${post.Username}-${post.PostIndex}`}
                        username={post.Username}
                        title={post.EventTitle}
                        date={post.Date}
                        time={post.Time}
                        location={post.Location}
                        summary={post.EventSummary}
                        image={post.ImageURL}
                        instagram={post.InstagramURL}
                    />
                ))}
            </HorizontalCarousel>

            <h2 className="text-2xl font-bold mb-2 pl-22 pt-8">computer science events</h2>
            <HorizontalCarousel>
                {sortedByTag("computer science").map((post) => (
                    <ClubCard
                        key={`${post.Username}-${post.PostIndex}`}
                        username={post.Username}
                        title={post.EventTitle}
                        date={post.Date}
                        time={post.Time}
                        location={post.Location}
                        summary={post.EventSummary}
                        image={post.ImageURL}
                        instagram={post.InstagramURL}
                    />
                ))}
            </HorizontalCarousel>

            <h2 className="text-2xl font-bold mb-2 pl-22 pt-8">robotics events</h2>
            <HorizontalCarousel>
                {sortedByTag("robotics").map((post) => (
                    <ClubCard
                        key={`${post.Username}-${post.PostIndex}`}
                        username={post.Username}
                        title={post.EventTitle}
                        date={post.Date}
                        time={post.Time}
                        location={post.Location}
                        summary={post.EventSummary}
                        image={post.ImageURL}
                        instagram={post.InstagramURL}
                    />
                ))}
            </HorizontalCarousel>

            <h2 className="text-2xl font-bold mb-2 pl-22 pt-8">all events</h2>
            <HorizontalCarousel>
                {sortedPosts.map((post) => (
                    <ClubCard
                        key={`${post.Username}-${post.PostIndex}`}
                        username={post.Username}
                        title={post.EventTitle}
                        date={post.Date}
                        time={post.Time}
                        location={post.Location}
                        summary={post.EventSummary}
                        image={post.ImageURL}
                        instagram={post.InstagramURL}
                    />
                ))}
            </HorizontalCarousel>
        </div>
    );
}

export default EventsList;
