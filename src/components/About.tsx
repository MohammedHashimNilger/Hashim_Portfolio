import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";
import { config } from "../config";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useEffect(() => {
    // Mobile entry animation: fade in about section when scrolled into view
    if (window.innerWidth <= 1024) {
      const aboutMe = document.querySelector(".about-me");
      if (aboutMe) {
        gsap.fromTo(
          aboutMe,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: aboutMe,
              start: "top 85%",
              end: "top 40%",
              toggleActions: "play none none reverse",
            },
          }
        );
        ScrollTrigger.refresh();
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (["aboutEntry"].includes(st.vars.id as string)) st.kill();
      });
    };
  }, []);

  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description}
        </p>
      </div>
    </div>
  );
};

export default About;
