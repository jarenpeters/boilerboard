import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ClubCard from "./ClubCard";
import HorizontalCarousel from "./HorizontalCarousel";

export default function EventsList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("https://boilerboard.onrender.com/events")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const renderCard = (post) => (
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
    );

    const filterByTag = (tag) =>
        posts.filter((post) => post.Tags?.includes(tag));

    const sortByDateDesc = (arr) =>
        [...arr].sort((a, b) => {
            if (!a.DateISO) return 1;
            if (!b.DateISO) return -1;
            return new Date(b.DateISO) - new Date(a.DateISO);
        });

    const sortedPosts = useMemo(() => sortByDateDesc(posts), [posts]);
    const sortedByTag = (tag) => sortByDateDesc(filterByTag(tag));

    const thisWeeksPosts = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        return posts
            .filter((post) => {
                if (!post.DateISO || post.DateISO === "NOT_FOUND") return false;
                const postDate = new Date(post.DateISO);
                return postDate >= startOfWeek && postDate <= endOfWeek;
            })
            .sort((a, b) => new Date(b.DateISO) - new Date(a.DateISO));
    }, [posts]);

    const allEmpty =
        !loading &&
        thisWeeksPosts.length === 0 &&
        sortedByTag("computer science").length === 0 &&
        sortedByTag("robotics").length === 0 &&
        sortedPosts.length === 0;

    if (loading || allEmpty) {
        return (
            <div className="px-6 sm:px-10 py-16 flex flex-col items-center gap-10">
                <h1 className="text-boilerbeige text-4xl -mt-14 font-bold opacity-80 animate-pulse">
                    loading events...
                </h1>

                {[1, 2, 3].map((section) => (
                    <div key={section} className="w-full max-w-screen-xl">
                        <div className="h-6 w-48 rounded-lg bg-white/10 shimmer mb-4 mx-2" />
                        <div className="flex gap-4 overflow-x-auto px-2">
                            {[1, 2, 3, 4, 5].map((card) => (
                                <div
                                    key={card}
                                    className="w-56 h-56 rounded-2xl bg-white/10 shimmer flex-shrink-0"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Reusable clickable header
    const SectionHeader = ({ label, type, value }) => {
        const param =
            type === "tag"
                ? `tag=${encodeURIComponent(value)}`
                : type === "filter"
                    ? `filter=${encodeURIComponent(value)}`
                    : `query=${encodeURIComponent(value)}`;

        return (
            <button
                onClick={() => navigate(`/search?${param}`)}
                className="flex items-center gap-2 pl-12 sm:pl-22 mb-2 group text-left pt-8"
            >
                <span className="text-2xl font-bold text-white group-hover:text-boilerbeige transition">
                    {label}
                </span>
                <ChevronRight
                    size={28}
                    className="mt-[3px] -ml-[8px] opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition"
                />
            </button>
        );
    };

    // Render carousel with optional "See All"
    const renderCarousel = (items, label, type, value) => {
        const displayItems =
            items.length > 20
                ? [...items.slice(0, 20), { type: "seeAll" }]
                : items;

        return (
            <HorizontalCarousel
                items={displayItems}
                renderItem={(item) => {
                    if (item.type === "seeAll") {
                        return (
                            <div
                                onClick={() =>
                                    navigate(
                                        `/search?${
                                            type === "tag"
                                                ? `tag=${encodeURIComponent(value)}`
                                                : `filter=${encodeURIComponent(value)}`
                                        }`
                                    )
                                }
                                className="w-28 h-140 rounded-3xl flex items-center justify-center
                                           cursor-pointer shadow-lg border border-white/10
                                           backdrop-blur-lg bg-boilergray/40 text-boilerbeige font-bold
                                           hover:bg-white/20 text-center transition"
                            >
                                see all
                            </div>
                        );
                    }
                    return renderCard(item);
                }}
            />
        );
    };

    return (
        <div>
            {thisWeeksPosts.length > 0 && (
                <>
                    <SectionHeader label="this week's events" type="filter" value="thisweek" />
                    {renderCarousel(thisWeeksPosts, "this week's events", "filter", "thisweek")}
                </>
            )}

            {sortedByTag("computer science").length > 0 && (
                <>
                    <SectionHeader
                        label="computer science events"
                        type="tag"
                        value="computer science"
                    />
                    {renderCarousel(
                        sortedByTag("computer science"),
                        "computer science events",
                        "tag",
                        "computer science"
                    )}
                </>
            )}

            {sortedByTag("robotics").length > 0 && (
                <>
                    <SectionHeader label="robotics events" type="tag" value="robotics" />
                    {renderCarousel(
                        sortedByTag("robotics"),
                        "robotics events",
                        "tag",
                        "robotics"
                    )}
                </>
            )}

            {sortedPosts.length > 0 && (
                <>
                    <SectionHeader label="all events" type="filter" value="all" />
                    {renderCarousel(sortedPosts, "all events", "filter", "all")}
                </>
            )}
        </div>
    );
}