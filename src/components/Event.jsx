import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import EventImg from "../assets/Event1.jpg";
import hackathonImg from "../assets/Event2.JPG";
import CSI25 from "../assets/Event3.JPG";
import Hackathon from "../assets/Event4.jpg";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const eventsData = [
    {
        id: 1,
        title: "Codeflix 2025",
        content:
            "An immersive **coding marathon** where developers, innovators, and tech enthusiasts come together **to create, collaborate, and compete**",
        image: EventImg,
        imageTitle: "Event",
    },
    {
        id: 2,
        title: "BugFather",
        content:
            "**BugFather** is an innovative event designed **to detect, track, and manage** software bugs efficiently.",
        image: hackathonImg,
        imageTitle: "Workshop",
    },
    {
        id: 3,
        title: "CSI 2025",
        content:
            "**CSI 2025** is the **ultimate tech fest** and innovation showcase, bringing together enthusiasts, developers, and innovators from across domains.",
        image:
            CSI25,
        imageTitle: "Tech Talk",
    },
    {
        id: 4,
        title: "CodeFlix 2025- Hackathon",
        content:
            "A high-energy, **24-hour coding marathon** where innovative minds come together to build creative solutions across **AI, Web, and Blockchain technologies.**",
        image:
            Hackathon,
        imageTitle: "Community Meet",
    },
];

const TimelineData = [
    {
        id: 1,
        cardName: "GitHub Copilot Workshop",
        date: "16 Sept 2025",
        time: "3 PM",
    },
    {
        id: 2,
        cardName: "Hackathon",
        date: "16 Oct 2025",
        time: "4 PM",
    },
    {
        id: 3,
        cardName: "Tech Talk",
        date: "25 Nov 2025",
        time: "3:30 PM",
    },
    {
        id: 4,
        cardName: "Community Meet",
        date: "13 Dec 2025",
        time: "11 AM",
    },
];

export default function Event() {
    const containerRef = useRef(null);
    const timelineRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Horizontal scroll + timeline
    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const sections = gsap.utils.toArray(".panel");
        if (sections.length === 0) return;

        const totalScroll = container.scrollWidth - window.innerWidth;

        const anim = gsap.to(sections, {
            x: -totalScroll,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top top",
                pin: true,
                scrub: 2,
                snap: 1 / (sections.length - 1),
                end: () => `+=${totalScroll}`,
                onUpdate: (self) => {
                    if (progressBarRef.current) {
                        progressBarRef.current.style.width = `${self.progress * 100}%`;
                    }
                },
                onEnter: () =>
                    timelineRef.current &&
                    gsap.to(timelineRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.25 }),
                onEnterBack: () =>
                    timelineRef.current &&
                    gsap.to(timelineRef.current, { autoAlpha: 1, pointerEvents: "auto", duration: 0.25 }),
                onLeave: () =>
                    timelineRef.current &&
                    gsap.to(timelineRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.25 }),
                onLeaveBack: () =>
                    timelineRef.current &&
                    gsap.to(timelineRef.current, { autoAlpha: 0, pointerEvents: "none", duration: 0.25 }),
            },
        });

        return () => {
            if (anim.scrollTrigger) anim.scrollTrigger.kill();
            anim.kill();
        };
    }, { scope: containerRef });

    useEffect(() => {
        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const renderContent = (content) => {
        return content.split(/(\*\*.*?\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
                <span className="text-[#ff6b7d]" key={i}>
                    {part.slice(2, -2)}
                </span>
            ) : (
                part
            )
        );
    };

    return (
        <>
            {/* Horizontal Scroll */}
            <div
                ref={containerRef}
                className="relative h-[calc(100vh-160px)] mt-6 mb-[160px] flex overflow-x-hidden"
                style={{ width: "auto" }}
            >
                <div className="absolute top-2 left-5 z-20">
                    <div className="title text-5xl uppercase">Events</div>
                    <div className="w-24 h-1" style={{ backgroundColor: "#ff6b7d" }} />
                </div>

                {/* Progress Bar */}
                <div
                    className="absolute bottom-0 left-0 w-full h-1 z-20"
                    style={{ backgroundColor: "rgba(156, 163, 175, 0.3)" }}
                >
                    <div ref={progressBarRef} className="h-full" style={{ width: "0%", backgroundColor: "#ff6b7d" }} />
                </div>

                {eventsData.map((panel) => (
                    <div key={panel.id} className="panel w-screen h-full flex-shrink-0 flex items-center justify-center px-0">
                        <div
                            className="relative w-full h-[70%] bg-white flex items-center justify-center cursor-pointer"
                            onClick={() => handleImageClick(panel.image)}
                        >
                            <img src={panel.image} alt={panel.imageTitle} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white max-w-[80%]">
                                <div className="text-lg font-bold uppercase">{panel.cardName}</div>
                                <h1 className="text-4xl md:text-5xl font-bold text-[#ff6b7d] uppercase">{panel.title}</h1>
                                <p className="mt-2 text-lg font-medium leading-snug">{renderContent(panel.content)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline */}
            <div
                ref={timelineRef}
                className="fixed bottom-0 left-0 w-full bg-white z-30 border-t border-gray-300 opacity-0 pointer-events-none"
                style={{ willChange: "opacity" }}
            >
                <div className="relative max-w-6xl mx-auto px-6 py-4">
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-black" />
                    <div className="relative flex justify-between items-center">
                        {TimelineData.map((event) => (
                            <div key={event.id} className="flex flex-col items-center relative">
                                <div className="w-5 h-5 bg-[#ff6b7d] rounded-full z-10 border-2 border-white shadow-md" />
                                <div className="mt-2 text-center">
                                    <div className="text-black text-base font-semibold">{event.cardName}</div>
                                    <div className="text-gray-500 text-base">
                                        {event.date} • {event.time}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10"
                        >
                            ×
                        </button>
                        <img
                            src={selectedImage}
                            alt="Event Panel Image"
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
