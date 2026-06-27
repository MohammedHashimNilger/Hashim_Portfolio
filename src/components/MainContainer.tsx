import { useEffect, useState, lazy, Suspense } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import TechStackNew from "./TechStackNew";
import CallToAction from "./CallToAction";
import setSplitText from "./utils/splitText";
import { setAllTimeline } from "./utils/GsapScroll";

// Character only loads on desktop
const CharacterModel = lazy(() => import("./Character"));

const MainContainer = () => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  // Career timeline — runs on all screen sizes (not just desktop)
  useEffect(() => {
    // Small delay to ensure Career DOM is rendered
    const timer = setTimeout(() => {
      setAllTimeline();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />

      {/* 3D character — fixed position, desktop only, rendered ONCE */}
      {isDesktopView && (
        <Suspense fallback={null}>
          <CharacterModel />
        </Suspense>
      )}

      <div className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStackNew />
        <CallToAction />
        <Contact />
      </div>
    </div>
  );
};

export default MainContainer;
