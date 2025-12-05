import React from "react"

export default function About() {
    return (
        <div className="text-white">
            <h1 className="text-center -pb-6 -mt-10 text-[100px] font-dmsans font-black"><em>made by jaren peters</em></h1>
            <div className="flex grid grid-cols-2 my-20 -mt-2 text-2xl font-dmsans font-extrabold text-center">
                <img src="https://jarenpeters.com/jarn1.ico" className="ml-20 w-170 h-120"/>
                <div>
                    <p className="mr-15 text-[100px]">“67”</p><p className="mr-15"> is more than just a number—it’s a cultural moment born from the viral song Doot Doot (6 7) by Skrilla and fueled by TikTok edits, basketball highlights, and the chaotic energy of Gen Z and Gen Alpha humor. What started as a simple chant referencing LaMelo Ball’s height and a viral clip of a kid shouting “six-seven” has exploded into classrooms, social media feeds, and everyday slang. “67” thrives on randomness, community, and the shared joy of something that makes no sense but somehow connects everyone who says it.</p>
                </div>
            </div>
        </div>
    );
}
