import {Link} from "react-router-dom";


function ClubCard({username, title, date, time, location, summary, image, instagram}) {
    return <div className="bg-boilerbeige justify-center pb-10 m-1 text-boilergray rounded-3xl w-76 h-140 font-dmsans">
        <div className="bg-boilergold rounded-3xl p-2.5 pb-6 h-102">
            <a href={instagram} target="_blank" rel="noopener noreferrer" title="open original post">
                <img className="rounded-2xl w-100 h-88 transition-all duration-200 hover:ring-5 hover:ring-boilergray/50" src={image} alt={'image not found'}/>
            </a>
            <h3 className="font-black text-xl p-1 pt-1.75">@{username}</h3>
        </div>
        <div className="inline-block m-3 mx-4">
            <p className="font-black -mb-1 -mt-1">{title}</p>
            <hr className="border-1 border-boilergray my-1" />
            {date !== "NOT_FOUND" && time !== "NOT_FOUND" && (
                <p className="font-medium -mb-2">{date} @ {time}</p>
            )}
            {date === "NOT_FOUND" && time !== "NOT_FOUND" && (
                <p className="font-medium -mb-2">@ {time}</p>
            )}
            {date !== "NOT_FOUND" && time === "NOT_FOUND" && (
                <p className="font-medium -mb-2">{date}</p>
            )}
            {location !== "NOT_FOUND" && <p className="font-medium">{location}</p>}
            {location === "NOT_FOUND" && <hr className="border-1 border-boilergray my-1 mt-3" />}
            {location !== "NOT_FOUND" &&<hr className="border-1 border-boilergray my-1" /> }
            <p className="leading-none">{summary}</p>
        </div>
    </div>
}

export default ClubCard