import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import csiLogo from '/logo.png'
import team2425 from '../assets/Team_2024-25.jpg'
import AboutUs2 from '../assets/AboutUs2.jpeg'
import AboutUs3 from '../assets/AboutUs3.jpg'
import AboutUs4 from '../assets/AboutUs4.jpg'
import { useMemo, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger,useGSAP);

const rotations = [
"rotate-[-20deg]", "rotate-[-15deg]", "rotate-[-10deg]",
  "rotate-[10deg]", "rotate-[15deg]", "rotate-[20deg]",
];

const panelsData = [
    {
        id: 1,
        cardName: "Who We Are",
        title: "Igniting Tech Passion",
        content: "CSI VIT Pune is a **dynamic community** of students driven by **curiosity and innovation**. We aim to empower members with skills, opportunities, and a platform to explore the ever-evolving world of technology.",
        image: team2425,
        imageTitle:"Team CSI 24-25"
    },
    {
        id: 2,
        cardName: "What We Do",
        title: "Workshops, Hackathons & More",
        content: "From **hands-on workshops** on AI, Blockchain, and coding to **thrilling hackathons and competitions**, we create experiences that blend learning, collaboration, and creativity.",
        image: AboutUs2,
        imageTitle:"GitHub Copilot Workshop"
    },
    {
        id: 3,
        cardName: "Industry & Growth",
        title: "Learning Beyond Classrooms",
        content: "We bring **industry experts** for talks, guide student projects, and encourage **innovation that solves real-world problems**. CSI is where ideas grow into impact.",
        image: AboutUs3,
        imageTitle:"MLOps Speaker Session"
    },
    {
        id: 4,
        cardName: "Community",
        title: "A Thriving Tech Family",
        content: "With **passionate members** and countless **success stories**, CSI VIT Pune is more than a club—it's a **family** where friendships, skills, and futures are built together.",
        image: AboutUs4,
        imageTitle:"Community"
    }
];

export default function AboutUs(){   
    const containerRef = useRef(null);  
    const title = useRef(null);
    const progressBarRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    
    const panelRotations = useMemo(() => {
        const shuffledRotations = [...rotations].sort(() => Math.random() - 0.5);
        return panelsData.map((_, index) => shuffledRotations[index % rotations.length]);
    }, []);

    useGSAP(()=>{   
        let sections = gsap.utils.toArray(".panel")
        console.log(containerRef.current.offsetWidth)
        
        gsap.to(sections,{
            xPercent: -100*(sections.length-1),
            ease:"none",
            scrollTrigger:{
                trigger:containerRef.current,
                start:"top",
                pin:true,
                scrub:2,
                snap:1/(sections.length-1),
                end:()=> "+=" + (containerRef.current.scrollWidth + 1000),
                onUpdate: (self) => {
                    const progress = self.progress * 100;
                    gsap.set(progressBarRef.current, { width: `${progress}%` });
                }
            }
        })
    },{scope:containerRef})

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };
    const renderContent = (content) => {
        const parts = content.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <span className="text-[#ff6b7d]" key={index}>{part.slice(2, -2)}</span>;
            }
            return part;
        });
    };

    return(
        <>
            <div ref={containerRef} className={`relative w-[${panelsData.length * 100}vw] h-screen flex overflow-x-hidden`}>
                <div ref={title} className="absolute top-2 left-5 z-20">
                    <div id="title" className="title text-5xl  uppercase">About Us</div>
                    <div className="w-24 h-1" style={{backgroundColor:"#ff6b7d"}}></div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 z-20" style={{ backgroundColor: 'rgba(156, 163, 175, 0.3)' }}>
                    <div 
                        ref={progressBarRef}
                        className="h-full transition-all duration-100 ease-out"
                        style={{ width: '0%', backgroundColor: '#ff6b7d' }}
                    ></div>
                </div>
                
                {panelsData.map((panel, index) => (
                    <div key={panel.id} className="panel w-screen h-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                        <div className="flex h-full w-full flex-col justify-end sm:justify-center items-center sm:ml-10"> 
                            <div className="text-xl font-bold mb-2 uppercase">{panel.cardName}</div>
                            <h1 className="text-5xl mb-10 text-[#ff6b7d] text-center audiowide uppercase">{panel.title}</h1>
                            <div className="w-24 h-1 mt-2" style={{backgroundColor:"#ff6b7d"}}></div>
                            <p className="text-center font-bold text-2xl px-10 mt-2">{renderContent(panel.content)}</p>
                        </div>
                        <div className="flex md:col-span-2 w-full h-full sm:items-center sm:justify-center overflow-visible hide-scrollbar hover:px-0">
                            <div className="polaroid flex m-auto overflow-visible hide-scrollbar">
                                <a title={`CSI ${panel.imageTitle}`}
                                className={`transition-transform overflow-hidden duration-300 hover:rotate-0 ${panelRotations[index]} grayscale hover:grayscale-0`}
                                onClick={() => handleImageClick(panel.image)}>
                                <img src={panel.image} className="block cursor-pointer object-cover"/>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
                    <div className="relative max-w-[90vw] max-h-[90vh]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 z-10">×</button>
                        <img src={selectedImage} alt="CSI Panel Image" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()}/>
                    </div>
                </div>
            )}
        </>
    )
}