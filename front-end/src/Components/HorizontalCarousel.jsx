import useEmblaCarousel from "embla-carousel-react";
import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HorizontalCarousel({ children }) {
    const [emblaRef, embla] = useEmblaCarousel({
        loop: false,
        dragFree: true,
        align: "start",
        containScroll: "trimSnaps",
    });

    const slides = React.Children.toArray(children);

    const [prevEnabled, setPrevEnabled] = useState(false);
    const [nextEnabled, setNextEnabled] = useState(false);

    const onSelect = useCallback(() => {
        if (!embla) return;
        setPrevEnabled(embla.canScrollPrev());
        setNextEnabled(embla.canScrollNext());
    }, [embla]);

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

    useEffect(() => {
        if (!embla) return;
        onSelect();
        embla.on("select", onSelect);
        embla.on("reInit", onSelect);
    }, [embla, onSelect]);

    return (
        <div className="relative w-full">

            {/* LEFT ARROW */}
            {prevEnabled && (
                <button
                    onClick={scrollPrev}
                    className="
                        absolute left-0 top-1/2 -translate-y-1/2 z-10
                        bg-black/30 hover:bg-black/50
                        backdrop-blur-lg text-white
                        rounded-full p-2 transition ml-8 border border-white/10 hover:translate-x-1
                    "
                >
                    <ChevronLeft size={42} />
                </button>
            )}

            {/* RIGHT ARROW */}
            {nextEnabled && (
                <button
                    onClick={scrollNext}
                    className="
                        absolute right-0 top-1/2 -translate-y-1/2 z-10
                        bg-black/30 hover:bg-black/50
                        backdrop-blur-lg text-white
                        rounded-full p-2 transition mr-8 border border-white/10 hover:-translate-x-1
                    "
                >
                    <ChevronRight size={42} />
                </button>
            )}

            {/* EMBLA VIEWPORT */}
            <div className="w-full overflow-hidden max-w-none" ref={emblaRef}>
                <div className="flex">
                    {slides.map((child, index) => (
                        <div
                            key={index}
                            className="flex-none w-72 mr-12 first:ml-19 last:mr-19"
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}