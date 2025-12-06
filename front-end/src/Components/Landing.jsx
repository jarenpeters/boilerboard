import { useEffect, useState } from "react";
import SearchBar from "./SearchBar.jsx";

function Landing() {
    const [checkStates, setCheckStates] = useState([
        { visible: false, duration: 0 },
        { visible: false, duration: 0 },
        { visible: false, duration: 0 },
        { visible: false, duration: 0 },
    ]);

    const positions = [
        { top: "5%", left: "5%" },
        { top: "5%", left: "55%" },
        { top: "55%", left: "5%" },
        { top: "55%", left: "55%" },
    ];

    /* ----------------------------------------
       TYPING EFFECT
    ---------------------------------------- */
    const rotatingWords = ["purdue", "robotics", "cultural", "research", "business"];
    const [displayWord, setDisplayWord] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        let timeout;
        let isDeleting = false;
        let charIndex = 0;

        const type = () => {
            const word = rotatingWords[currentIndex];

            if (!isDeleting) {
                // typing forward
                setDisplayWord(word.substring(0, charIndex + 1));
                charIndex++;

                if (charIndex === word.length) {
                    // If it's "purdue", pause longer
                    const extraPause = word === "purdue" ? 3000 : 0;
                    timeout = setTimeout(() => {
                        isDeleting = true;
                        type();
                    }, 1200 + extraPause);
                    return;
                }
            } else {
                // deleting
                setDisplayWord(word.substring(0, charIndex - 1));
                charIndex--;

                if (charIndex === 0) {
                    // move to next word
                    isDeleting = false;
                    setCurrentIndex((prev) => (prev + 1) % rotatingWords.length);
                }
            }

            timeout = setTimeout(type, isDeleting ? 70 : 120);
        };

        type();
        return () => clearTimeout(timeout);
    }, [currentIndex]);

    /* ----------------------------------------
       CHECK MARK ANIMATIONS
    ---------------------------------------- */
    useEffect(() => {
        let isMounted = true;
        const wait = (ms) => new Promise((res) => setTimeout(res, ms));

        const animateCheckLoop = async (i) => {
            while (isMounted) {
                const visibleDuration = 3000 + Math.random() * 6000;
                const initialDelay = Math.random() * 9000;

                await wait(initialDelay);
                if (!isMounted) break;

                setCheckStates((prev) => {
                    const newState = [...prev];
                    newState[i] = { visible: true, duration: visibleDuration };
                    return newState;
                });

                await wait(visibleDuration);
                if (!isMounted) break;

                setCheckStates((prev) => {
                    const newState = [...prev];
                    newState[i] = { visible: false, duration: 0 };
                    return newState;
                });
            }
        };

        [0, 1, 2, 3].forEach((i) => animateCheckLoop(i));

        return () => (isMounted = false);
    }, []);

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center mt-2 mx-10 gap-10 lg:gap-16 -mb-8">

            {/* LEFT SIDE — full width on mobile */}
            <div className="flex flex-col items-start gap-6 w-full sm:w-140 lg:w-180 xl:w-1/2">

                {/* TYPING TEXT */}
                <div className="mx-auto xl:mx-0">
                    <div className="
                    font-dmsans font-extrabold text-left
                    text-[3.75rem] sm:text-[5rem] md:text-[5rem] lg:text-[7rem] xl:text-[8rem]
                    leading-[0.8] w-full">
                        <h1 className="whitespace-nowrap mx-auto">
                            never miss<br />
                            a{" "}
                            <em className="font-light">
                                {displayWord}
                                <span className="cursor ml-1"></span>
                            </em>
                            <span className="animate-blink font-light">|</span>
                            <br />
                            event again
                        </h1>
                    </div>
                    <p className="text-l lg:text-2xl xl:text-2xl text-boilerbeige/70 mt-4 lg:mt-6 w-full">
                        find all boilermaker events, right where you need them.
                    </p>
                </div>

                {/* SEARCH — full-width on mobile */}
                <div className="w-full">
                    <SearchBar className="w-full" />
                </div>
            </div>

            {/* RIGHT SIDE — post-its & check marks (hidden earlier) */}
            <div className="hidden xl:block relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[480px] lg:h-[480px]">
                <img
                    src="/heroposts.png"
                    alt="4 post-it notes"
                    className="w-full h-full object-contain"
                />

                {checkStates.map((c, i) =>
                    c.visible ? (
                        <img
                            key={i}
                            src="/check.png"
                            alt="check mark"
                            className="absolute w-46 mt-2 animate-check"
                            style={{
                                ...positions[i],
                                animation: `fadeInHoldFadeOut ${c.duration + 500}ms ease-in-out forwards`,
                            }}
                        />
                    ) : null
                )}
            </div>
        </div>
    );
}

export default Landing;