import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { Link } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const MOBILE_BREAKPOINT = 768;

const Work = () => {
  useEffect(() => {
    let cleanupFn: (() => void) | null = null;

    function initAnimations() {
      // Kill everything before re-initializing
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.set(".work-flex", { clearProps: "x" });
      gsap.set(".work-box", { clearProps: "opacity,y,transform" });

      if (cleanupFn) {
        cleanupFn();
        cleanupFn = null;
      }

      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        // ── MOBILE: vertical fade-in per card ──
        const workBoxes = document.querySelectorAll<HTMLElement>(".work-box");

        const tweens: gsap.core.Tween[] = [];
        workBoxes.forEach((box) => {
          const tween = gsap.fromTo(
            box,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: box,
                start: "top 85%",
                end: "top 40%",
                toggleActions: "play none none reverse",
              },
            }
          );
          tweens.push(tween);
        });

        ScrollTrigger.refresh();

        cleanupFn = () => {
          tweens.forEach((t) => t.kill());
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      } else {
        // ── DESKTOP: horizontal pinned scroll ──
        let translateX = 0;

        function setTranslateX() {
          const boxes = document.getElementsByClassName("work-box");
          if (boxes.length === 0) return;
          const containerLeft = document
            .querySelector(".work-container")!
            .getBoundingClientRect().left;
          const rect = boxes[0].getBoundingClientRect();
          const parentWidth =
            boxes[0].parentElement!.getBoundingClientRect().width;
          const padding =
            parseInt(window.getComputedStyle(boxes[0]).padding) / 2;
          translateX =
            rect.width * boxes.length - (containerLeft + parentWidth) + padding;
        }

        setTranslateX();

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".work-section",
            start: "top top",
            end: `+=${translateX}`,
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            id: "work",
            invalidateOnRefresh: true,
          },
        });

        timeline.to(".work-flex", {
          x: -translateX,
          ease: "none",
        });

        ScrollTrigger.refresh();

        cleanupFn = () => {
          timeline.kill();
          ScrollTrigger.getById("work")?.kill();
        };
      }
    }

    // Init on mount
    initAnimations();

    // Re-init on resize (handles orientation change too)
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initAnimations();
      }, 200);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      if (cleanupFn) cleanupFn();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <div className="work-flex">
          {config.projects.slice(0, 5).map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
                <div className="work-text-links">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-text-link"
                    >
                      Live
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="work-text-link"
                    >
                      Repo
                    </a>
                  )}
                </div>
              </div>
              <WorkImage
                image={project.image}
                alt={project.title}
                link={project.live}
              />
            </div>
          ))}
          <div className="work-box work-box-cta">
            <div className="see-all-works">
              <h3>Want to see more?</h3>
              <p>Explore all of my projects and creations</p>
              <Link to="/myworks" className="see-all-btn" data-cursor="disable">
                See All Works →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;