import React from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// --- sample data (same as yours) ---
const coreMembers = [
  { name: "Ansh Sharma", role: "Chair Person", img: "https://picsum.photos/300/400?random=1" },
  { name: "Purva Rathi", role: "Secretary", img: "https://picsum.photos/300/400?random=2" },
  { name: "Tejas Desale", role: "Treasurer", img: "https://picsum.photos/300/400?random=3" },
  { name: "Shripad Kanakdande", role: "P.R. Officer", img: "https://picsum.photos/300/400?random=4" },
  { name: "Shruti Raina", role: "Event Coordinator", img: "https://picsum.photos/300/400?random=5" },
];

const teams = [
  {
    head: { name: "Rajwardhan Mali", role: "Tech Head", img: "https://picsum.photos/300/400?random=6" },
    secretaries: [
      { name: "Rachit Ingole", role: "Web Dev Secretary", img: "https://picsum.photos/300/400?random=7" },
      { name: "Shreya Ranjan", role: "Web Dev Secretary", img: "https://picsum.photos/300/400?random=8" },
      { name: "Prasad Koshatwar", role: "AI/ML Secretary", img: "https://picsum.photos/300/400?random=9" },
      { name: "Anvesha Vyas", role: "AI/ML Secretary", img: "https://picsum.photos/300/400?random=10" },
      { name: "Amit Raut", role: "App Developement Secretary", img: "https://picsum.photos/300/400?random=11" },
      { name: "Swanandi Bhende", role: "Blockchain Secretary", img: "https://picsum.photos/300/400?random=12" },
      { name: "Rakshit Oswal", role: "DSA Secretary", img: "https://picsum.photos/300/400?random=13" },
      { name: "Devang Deshpande", role: "DSA Secretary", img: "https://picsum.photos/300/400?random=14" },
    ],
  },
  {
    head: [
      { name: "Ayush Gupta", role: "Management Head", img: "https://picsum.photos/300/400?random=15" },
      { name: "Harsh Kumar", role: "Management Head", img: "https://picsum.photos/300/400?random=16" }
    ],
    secretaries: [
      { name: "Divya Asnani", role: "Database Secretary", img: "https://picsum.photos/300/400?random=17" },
      { name: "Sayali Nevhal", role: "Database Secretary", img: "https://picsum.photos/300/400?random=18" },
      { name: "Venugopal Baheti", role: "Sponsorship Secretary", img: "https://picsum.photos/300/400?random=19" },
      { name: "Vishruti Mohinkar", role: "Sponsorship Secretary", img: "https://picsum.photos/300/400?random=20" },
      { name: "Palash Koul", role: "Publicity Secretary", img: "https://picsum.photos/300/400?random=21" },
      { name: "Disha Dubey", role: "Publicity Secretary", img: "https://picsum.photos/300/400?random=22" },
      { name: "Assad Sayyed", role: "Corporate Relations Secretary", img: "https://picsum.photos/300/400?random=23" },
      { name: "Priyansh Jain", role: "Corporate Relations Secretary", img: "https://picsum.photos/300/400?random=24" },
      { name: "Ayush Singh", role: "Operations and Venue Secretary", img: "https://picsum.photos/300/400?random=23" },
      { name: "Shreyas Padir", role: "Operations and Venue Secretary", img: "https://picsum.photos/300/400?random=24" },
      { name: "Omkar Patil", role: "Finance Secretary", img: "https://picsum.photos/300/400?random=24" },
    ],
  },
  {
    head: { name: "Labhesh Pahade", role: "Creatives Head", img: "https://picsum.photos/300/400?random=25" },
    secretaries: [
      { name: "Dhiraj Patil", role: "Multimedia Secretary", img: "https://picsum.photos/300/400?random=26" },
      { name: "Hrishika Fule", role: "Multimedia Secretary", img: "https://picsum.photos/300/400?random=27" },
      { name: "Aachal Borle", role: "Aesthetics Secretary", img: "https://picsum.photos/300/400?random=28" },
      { name: "Swastik Jha", role: "Content and Social Media Secretary", img: "https://picsum.photos/300/400?random=29" },
    ],
  },
];

// --- main component ---
export default function MeetTheTeam() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <section className="relative py-16 px-6 bg-gray-300 overflow-hidden text-gray-900">
      {/* constellation particles */}
      <Particles
  id="tsparticles"
  init={particlesInit}
  className="absolute inset-0 -z-30"
  options={{
    background: { color: "#9ca3af" }, // grey background
    fpsLimit: 60,
    particles: {
      number: { value: 100, density: { enable: true, area: 800 } },
      color: { value: "#ff1a1a" },        // bright red
      links: {
        enable: true,
        color: "#ff1a1a",
        distance: 150,
        opacity: 0.8,
        width: 1.5,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        outModes: { default: "bounce" },
      },
      opacity: { value: 1 },
      size: { value: { min: 2, max: 4 } },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: false },
        resize: true,
      },
      modes: { grab: { distance: 200, links: { opacity: 1 } } },
    },
    detectRetina: true,
  }}
/>






      <div className="max-w-6xl mx-auto relative">
        {/* heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-wider mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff2d7a] to-[#ff5b9a]">
            Meet
          </span>{" "}
          <span className="text-gray-800">Our Team</span>
        </h2>
        <p className="text-center text-sm text-gray-600 mb-12">
          Cyberpunk × Glassmorphism vibes in a light futuristic theme
        </p>

        {/* Core team */}
        <TeamSection title="Core Team">
          <div className="flex flex-wrap justify-center gap-6">
            {coreMembers.map((m, i) => (
              <Card key={i} {...m} />
            ))}
          </div>
        </TeamSection>

        {/* Heads + Secretaries */}
        {teams.map((team, i) => (
          <TeamSection
            key={i}
            title={Array.isArray(team.head) ? "Management Heads" : team.head.role}
            subtle
          >
            <div className="flex justify-center mb-6 flex-wrap gap-6">
              {Array.isArray(team.head)
                ? team.head.map((h, idx) => <Card key={idx} {...h} />)
                : <Card {...team.head} />}
            </div>
            <div className="flex flex-wrap justify-center gap-y-6">
              {team.secretaries.map((s, j) => (
                <div key={j} className="w-[50%] flex justify-center">
                  <Card {...s} />
                </div>
              ))}
            </div>
          </TeamSection>
        ))}
      </div>

      {/* inline CSS */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradientMove {
          background-size: 200% 200%;
          animation: gradientMove 12s ease infinite;
        }

        @keyframes holoMove {
          0% { transform: rotate(25deg) translateX(-100%); }
          50% { transform: rotate(25deg) translateX(100%); }
          100% { transform: rotate(25deg) translateX(-100%); }
        }
        .holo-sheen-global {
          position: absolute;
          inset: 0;
          z-index: -10;
          pointer-events: none;
          background: repeating-linear-gradient(
            120deg,
            rgba(255,255,255,0.3) 0%,
            rgba(255,255,255,0.6) 30%,
            rgba(255,255,255,0.3) 60%,
            rgba(255,255,255,0) 100%
          );
          transform: rotate(25deg) translateX(-100%);
          mix-blend-mode: overlay;
          animation: holoMove 15s ease-in-out infinite;
        }

        .neon-label {
          position: relative;
          color: #222;
        }
        .neon-label::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: -8px;
          width: 140px;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(255,45,122,0.9), rgba(255,91,154,0.8));
          box-shadow: 0 6px 18px rgba(255,45,122,0.25), 0 0 32px rgba(255,91,154,0.15);
        }

        .glass-card {
          position: relative;
          width: 18rem;
          height: 24rem;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          background: rgba(255,255,255,0.75);
          backdrop-filter: blur(12px) saturate(160%);
          border: 1px solid rgba(255,45,122,0.3);
          transition: transform 0.45s cubic-bezier(.2,.9,.2,1), box-shadow 0.45s;
        }
        .glass-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 18px 60px rgba(255,45,122,0.35), 0 0 60px rgba(0,255,255,0.25);
        }
        .glass-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: all 0.5s ease;
        }
        .glass-card:hover img {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
        .glass-card-text {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 0.75rem;
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(8px) saturate(140%);
          text-align: center;
        }
        .glass-card-text .name {
          font-weight: 700;
          font-size: 1rem;
          color: #111;
        }
        .glass-card-text .role {
          font-size: 0.875rem;
          color: #444;
        }

        section *::-webkit-scrollbar { display: none !important; }
        section * { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>
    </section>
  );
}

// --- section wrapper ---
function TeamSection({ title, children, subtle }) {
  return (
    <div className="mb-12">
      <h3 className={`mb-6 text-center uppercase tracking-wide font-semibold neon-label ${subtle ? "opacity-80" : ""}`}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- universal card ---
function Card({ name, role, img }) {
  return (
    <div className="glass-card">
      <img src={img} alt={name} />
      <div className="glass-card-text">
        <div className="name">{name}</div>
        <div className="role">{role}</div>
      </div>
    </div>
  );
}
