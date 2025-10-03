"use client";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  forwardRef,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ChevronDown,
  Calendar,
  Users,
  Sparkles,
} from "lucide-react";
import image from "../assets/Team_2024-25.jpg";
import LetterGlitch from "./LetterGlitch";

gsap.registerPlugin(ScrollTrigger);

// Small utilities
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/* SplitText-like component (supports ref) */
const SplitText = forwardRef(function SplitText(
  { text, by = "chars", className = "", as: Tag = "h1", align = "center" },
  ref
) {
  const wrapperRef = useRef(null);
  const mergedRef = (node) => {
    wrapperRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const tokens = useMemo(() => {
    if (!text) return [];
    if (by === "words") return text.split(/(\s+)/);
    // default to chars, keep spaces as their own spans to preserve spacing
    return Array.from(text.replace(/\n/g, "\u200A\n"));
  }, [text, by]);

  return (
    <Tag
      ref={mergedRef}
      className={cn(
        "split-wrapper",
        className,
        align === "center" && "text-center"
      )}
      data-split-by={by}
    >
      {by === "words"
        ? tokens.map((w, i) =>
            w === " " || /\s+/.test(w) ? (
              <span key={i} className="inline-block w-2"></span>
            ) : (
              <span key={i} className="word inline-block overflow-visible">
                {Array.from(w).map((c, j) => (
                  <span
                    key={j}
                    className={cn(" inline-block will-change-transform")}
                  >
                    {c}
                  </span>
                ))}
              </span>
            )
          )
        : tokens.map((c, i) =>
            c === "\n" ? (
              <br key={i} />
            ) : c === " " ? (
              <span key={i} className="inline-block w-4" />
            ) : (
              <span
                key={i}
                className={cn("char inline-block will-change-transform")}
              >
                {c}
              </span>
            )
          )}
    </Tag>
  );
});

// Magnetic Button (enhanced)
function MagneticButton({ children, className = "", ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // magnetic movement
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: x * 0.18,
        y: y * 0.12,
        duration: 0.45,
        overwrite: true,
      });
      gsap.to(el, { rotation: x * 0.006, duration: 0.45, overwrite: true });
    };
    const onLeave = () =>
      gsap.to(el, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.45,
        ease: "expo.out",
      });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    const onDown = () => gsap.to(el, { scale: 0.98, duration: 0.12 });
    const onUp = () =>
      gsap.to(el, { scale: 1, duration: 0.18, ease: "expo.out" });
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-2xl px-6 py-3 font-medium shadow-lg transition active:scale-[.98] overflow-hidden",
        className
      )}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 transform scale-0 rounded-2xl opacity-0 transition-all pointer-events-none"
      />
      {children}
    </button>
  );
}

export default function HeroSection() {
  const root = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);

  // useIsomorphicLayoutEffect(() => {
  //   const ctx = gsap.context(() => {
  //     // --- Loader animation (improved) ---
  //     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  //     // show loader
  //     tl.set("#loader", { autoAlpha: 1, display: "grid" })
  //       .from("#loader .logo-wrap", {
  //         scale: 0.7,
  //         rotation: -20,
  //         autoAlpha: 0,
  //         duration: 0.9,
  //       })
  //       .from(
  //         "#loader .dot",
  //         {
  //           y: 24,
  //           autoAlpha: 0,
  //           stagger: 0.09,
  //           duration: 0.5,
  //         },
  //         "<0.05"
  //       )
  //       .to(
  //         "#loader .logo-wrap",
  //         {
  //           rotation: 360,
  //           duration: 1.8,
  //           ease: "none",
  //           repeat: 1,
  //           yoyo: true,
  //         },
  //         "+=0.2"
  //       )
  //       .to(
  //         "#loader",
  //         {
  //           yPercent: -120,
  //           autoAlpha: 0,
  //           duration: 0.9,
  //           ease: "power4.inOut",
  //           delay: 0.2,
  //         },
  //         "+=0.15"
  //       )
  //       .set("#loader", { display: "none" });

  //     // Hero split text animations
  //     const heroChars = heroTitleRef.current?.querySelectorAll(".char");
  //     const heroWords =
  //       heroSubRef.current?.querySelectorAll(".word .char, .char");
  //     if (heroChars && heroChars.length) {
  //       gsap.fromTo(
  //         heroChars,
  //         {
  //           yPercent: 140,
  //           rotation: () => gsap.utils.random(-12, 12),
  //           autoAlpha: 0,
  //         },
  //         {
  //           yPercent: 0,
  //           autoAlpha: 1,
  //           rotation: 0,
  //           stagger: { each: 0.018, from: "center" },
  //           duration: 1.05,
  //           ease: "elastic.out(1, 0.7)",
  //           delay: 0.18,
  //         }
  //       );
  //     }
  //     if (heroWords && heroWords.length) {
  //       gsap.from(heroWords, {
  //         yPercent: 140,
  //         autoAlpha: 0,
  //         stagger: 0.007,
  //         duration: 0.95,
  //         ease: "power3.out",
  //         delay: 0.38,
  //       });
  //     }

  //     // subtle blob float
  //     gsap.to(".blob", {
  //       x: (i) => (i % 2 === 0 ? 50 : -50),
  //       y: (i) => (i % 2 === 0 ? -20 : 40),
  //       duration: 9,
  //       repeat: -1,
  //       yoyo: true,
  //       ease: "sine.inOut",
  //     });

  //     // event card reveal + hover tilt
  //     gsap.utils.toArray(".event-card").forEach((card, i) => {
  //       gsap.set(card, { y: 40, autoAlpha: 0 });
  //       ScrollTrigger.create({
  //         trigger: card,
  //         start: "top 88%",
  //         onEnter: () =>
  //           gsap.to(card, {
  //             y: 0,
  //             autoAlpha: 1,
  //             duration: 0.8,
  //             delay: i * 0.06,
  //             ease: "power3.out",
  //           }),
  //       });

  //       // hover tilt
  //       const onMove = (ev) => {
  //         const rect = card.getBoundingClientRect();
  //         const px = (ev.clientX - rect.left) / rect.width;
  //         const py = (ev.clientY - rect.top) / rect.height;
  //         const rx = (py - 0.5) * 8;
  //         const ry = (px - 0.5) * -12;
  //         gsap.to(card, {
  //           rotateX: rx,
  //           rotateY: ry,
  //           scale: 1.02,
  //           duration: 0.01,
  //           ease: "none",
  //         });
  //       };
  //       const onLeave = () =>
  //         gsap.to(card, {
  //           rotateX: 0,
  //           rotateY: 0,
  //           scale: 1,
  //           duration: 0.45,
  //           ease: "expo.out",
  //         });
  //       card.addEventListener("mousemove", onMove);
  //       card.addEventListener("mouseleave", onLeave);
  //     });

  //     // marquee smooth loop: duplicate children to prevent jump
  //     const marquees = gsap.utils.toArray(".animate-marquee");
  //     marquees.forEach((m) => {
  //       const children = Array.from(m.children);
  //       children.forEach((c) => m.appendChild(c.cloneNode(true)));
  //     });

  //     // add cursor interactions
  //     const dot = cursorDot.current;
  //     const ring = cursorRing.current;
  //     if (dot && ring) {
  //       gsap.set(dot, { scale: 0.9 });
  //       gsap.set(ring, { scale: 1 });
  //       const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  //       const qDot = gsap.quickSetter(dot, "x", "px");
  //       const qDotY = gsap.quickSetter(dot, "y", "px");

  //       const move = (e) => {
  //         pos.x = e.clientX;
  //         pos.y = e.clientY;
  //         qDot(pos.x - 6); // offset small center
  //         qDotY(pos.y - 6);
  //         // delayed ring
  //         gsap.to(ring, {
  //           x: pos.x - 18,
  //           y: pos.y - 18,
  //           duration: 0.01,
  //           ease: "none",
  //         });
  //       };
  //       window.addEventListener("mousemove", move);

  //       // interactive change on hover
  //       const interactiveEls = document.querySelectorAll(
  //         "a, button, input, textarea, .magnetic, .event-card, .time-card, .group-btn"
  //       );
  //       interactiveEls.forEach((el) => {
  //         el.addEventListener("mouseenter", () => {
  //           gsap.to(ring, { scale: 1.6, duration: 0.24, ease: "expo.out" });
  //           gsap.to(dot, { scale: 0.6, duration: 0.24, ease: "expo.out" });
  //         });
  //         el.addEventListener("mouseleave", () => {
  //           gsap.to(ring, { scale: 1, duration: 0.22, ease: "expo.out" });
  //           gsap.to(dot, { scale: 0.9, duration: 0.22, ease: "expo.out" });
  //         });
  //       });

  //       // pointer down effect
  //       window.addEventListener("mousedown", () => {
  //         gsap.to(dot, { scale: 0.45, duration: 0.12 });
  //         gsap.to(ring, { scale: 2.1, duration: 0.18 });
  //       });
  //       window.addEventListener("mouseup", () => {
  //         gsap.to(dot, { scale: 0.9, duration: 0.18 });
  //         gsap.to(ring, { scale: 1, duration: 0.18 });
  //       });
  //     }
  //   }, root);
  //   return () => ctx.revert();
  // }, []);

  return (
    <>

    <div
      ref={root}
      className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-200/60 selection:text-indigo-900"
    >
      {/* Custom cursor (large ring + dot) */}
      <div
        ref={cursorDot}
        className="custom-cursor custom-cursor-dot pointer-events-none fixed z-[10000] h-3 w-3 rounded-full shadow"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
        aria-hidden
      />

      {/* HERO */}
      <section
        id="home"
        className="relative isolate overflow-hidden flex items-center h-screen"
      >
        <div className="absolute inset-0 -z-10 w-full h-full pointer-events-none">
          <LetterGlitch
            glitchSpeed={50}
            centerVignette={false}
            outerVignette={false}
            smooth={true}
          />
        </div>
        {/* background shapes - more blobs */}
        {/* <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="blob absolute -left-32 top-16 h-80 w-80 rounded-full bg-[#a54657]/25 blur-3xl" />
          <div className="blob absolute right-8 top-32 h-72 w-72 rounded-full bg-pink-200/50 blur-3xl" />
          <div className="blob absolute -bottom-20 left-1/4 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
          <div className="blob absolute top-1/2 -right-16 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl" />
          <div className="blob absolute bottom-1/4 -left-20 h-56 w-56 rounded-full bg-indigo-200/35 blur-3xl" />
          <div className="blob absolute top-20 right-1/3 h-48 w-48 rounded-full bg-[#a54657]/20 blur-2xl" />
          <div className="blob absolute bottom-32 right-1/4 h-64 w-64 rounded-full bg-pink-300/25 blur-3xl" />
        </div> */}

        <div className="pt-[100px] sm:mx-auto ">
          <div className="grid md:grid-cols-2 items-center gap-8 w-screen">
            <div className="flex flex-col h-screen items-center justify-center">
              <h1 className="text-[85px] text-[#a54657] px-4 backdrop-blur-[1px] audiowide inline bold">
                Building What Matters.
              </h1>
              <h1 className="text-2xl inline px-4 backdrop-blur-[1px]">
                {" "}
                COMPUTER SOCIETY OF INDIA STUDENT BRANCH, VIT PUNE
              </h1>
              <div className="mt-6 flex flex-wrap justify-center items-center gap-3 h-[100px] w-[600px]">
                {" "}
                {/* Reduced from mt-8 to mt-6 */}
                {/* Primary Button (filled with #a54657) */}
                <MagneticButton className="fire-hover btn-csi text-lg rounded-2xl px-1 py-3 magnetic group-btn mx-3">
                  CODEFLIX <ArrowRight className="h-4 w-4" />
                </MagneticButton>

                {/* Secondary (outline) */}
                <MagneticButton className="fire-hover btn-csi-outline text-lg rounded-2xl px-6 py-3 magnetic">
                  Explore Events <Calendar className="h-4 w-4" />
                </MagneticButton>
              </div>
              {/* <div className="mt-8 flex items-center gap-4 text-sm text-slate-500">
          <div className="h-[1px] w-24 bg-slate-300" />
          Scroll to discover <ChevronDown className="h-4 w-4" />
        </div> */}
            </div>
            <div className="relative p-2 md:m-20 w-fit">
              {/* hero illustration / collage */}
              <div className="aspect-[4/3] rounded-3xl border border-slate-200 bg-white/70 p-2 shadow-lg backdrop-blur anim-img">
                <div
                  className="h-full w-full rounded-2xl border-2 border-dashed border-slate-300 grid place-items-center text-slate-400 transition-transform will-change-transform"
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width;
                    const py = (e.clientY - rect.top) / rect.height;
                    gsap.to(el, {
                      rotateY: (px - 0.5) * 6,
                      rotateX: (0.5 - py) * 6,
                      duration: 0.01,
                      ease: "none",
                    });
                  }}
                  onMouseLeave={(e) =>
                    gsap.to(e.currentTarget, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.5,
                      ease: "expo.out",
                    })
                  }
                >
                  <img
                    src={image}
                    alt="Hero"
                    className="h-full w-full object-cover rounded-2xl"
                  />
                </div>
              </div>
              <div
                className="absolute -left-0 -top-0 hidden h-16 w-16 rounded-2xl bg-white p-3 shadow md:block"
                data-parallax="60"
              >
                <Users className="h-full w-full text-slate-700" />
              </div>
              <div
                className="absolute right-0 bottom-2 hidden h-16 w-16 rounded-2xl bg-white p-3 shadow md:block"
                data-parallax="40"
              >
                <Calendar className="h-full w-full text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Page-level styles */}
      <style jsx global>{`
      /* Custom heading styles */
      .hero-heading {
        color: #5c1f2b;
        font-size: clamp(2.5rem, 5vw, 3.75rem);
        font-weight: 1000; /* This is equivalent to font-black */
        line-height: 1.1;
        letter-spacing: -0.025em;
        text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        font-size: 5rem;
        margin-bottom: 0.5rem; /* Added to control spacing below heading */
      }
      
      .hero-subheading {
        color: #5c1f2b;
        opacity: 0.8;
        font-size: 1.125rem;
        line-height: 1.6;
        font-weight: 400;
        line-height: 1.4; /* Reduced from 1.6 */  
        margin-bottom: 0; /* Remove default margin */
      }
      
      @media (min-width: 768px) {
        .hero-subheading {
          font-size: 1.25rem;
        }
      }
      
      /* Ensure the characters inherit the font weight */
      .split-wrapper .char {
        font-weight: inherit !important;
      }

      :root{
  --csi:#a54657;
  --csi-dark:#923947;
  --csi-glow:rgba(165,70,87,0.4);
}


/* primary (filled) */
.btn-csi{
  background-color:var(--csi) !important;
  color:#fff !important;
  box-shadow:0 10px 24px var(--csi-glow);
}
.btn-csi:hover{
  background-color:var(--csi-dark) !important;
  box-shadow:0 0 28px rgba(165,70,87,0.6), 0 10px 24px var(--csi-glow);
}

/* secondary (outline) */
.btn-csi-outline{
  background:#fff !important;
  color:var(--csi) !important;
  border-color:var(--csi) !important;
}
.btn-csi-outline:hover{
  box-shadow:0 0 24px rgba(165,70,87,0.35);
}

/* fire from bottom reusing your hover trigger */
@keyframes fireBottom{
  0%{ box-shadow:0 6px 10px rgba(255,107,107,0.35), 0 12px 18px rgba(255,62,62,0.28); }
  50%{ box-shadow:0 10px 24px rgba(255,62,62,0.55), 0 18px 28px rgba(255,30,30,0.38); }
  100%{ box-shadow:0 6px 10px rgba(255,107,107,0.35), 0 12px 18px rgba(255,62,62,0.28); }
}
.magnetic.fire-hover:hover{
  animation:fireBottom 1s infinite ease-in-out;
}

      /* Fire flicker rising from bottom */
      @keyframes fireBottom {
        0% {
          box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4),
                      0 8px 16px rgba(255, 62, 62, 0.3);
        }
        50% {
          box-shadow: 0 6px 18px rgba(255, 62, 62, 0.6),
                      0 12px 24px rgba(255, 30, 30, 0.4);
        }
        100% {
          box-shadow: 0 4px 8px rgba(255, 107, 107, 0.4),
                      0 8px 16px rgba(255, 62, 62, 0.3);
        }
      }

      /* trigger fire when hovering */
      .magnetic.fire-hover:hover {
        animation: fireBottom 1s infinite ease-in-out;
      }

        html {
          scroll-behavior: smooth;
        }

        /* Hide default cursor on capable devices (desktop) to use our custom one */
        // @media (hover: hover) and (pointer: fine) {
        //   html {
        //     cursor: none;
        //   }
        // }

        .custom-cursor {
          transition: transform 0.12s ease, background-color 0.25s ease,
            opacity 0.2s ease;
          will-change: transform, opacity;
        }
        .custom-cursor-dot {
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: #0f172a;
        }
        .custom-cursor-ring {
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .animate-marquee {
          display: inline-flex;
          animation-name: marquee;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .split-wrapper .char {
          will-change: transform, opacity;
          transform-origin: 50% 100%;
          display: inline-block;
        }

        .anim-img {
          will-change: transform;
          transform-style: preserve-3d;
        }

        /* ensure focus states are visible even though we hide cursor on pointer devices */
        a:focus,
        button:focus {
          outline: 3px solid rgba(99, 102, 241, 0.16);
          outline-offset: 3px;
        }

        /* Loader bounce dots */
        .dot {
          display: inline-block;
        }
        .animate-bounce {
          animation: loader-bounce 0.7s infinite ease-in-out;
        }
        @keyframes loader-bounce {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-6px);
            opacity: 0.9;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Buttons & micro interactions */
        .group-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
    </>
  );
}