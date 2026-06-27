import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character) return;

  // Kill any existing char timelines to avoid conflicts on resize
  ScrollTrigger.getAll()
    .filter((t) => ["charTL1", "charTL2", "charTL3", "charTL4", "charTL5", "charTL6", "charTL7", "charTL8"].includes(t.vars.id as string))
    .forEach((t) => t.kill());

  const headBone =
    character.getObjectByName("mixamorigHead") ||
    character.getObjectByName("mixamorig:Head") ||
    character.getObjectByName("Head") ||
    null;

  const neckBone =
    character.getObjectByName("mixamorigNeck") ||
    character.getObjectByName("mixamorig:Neck") ||
    character.getObjectByName("Neck") ||
    null;

  const leftArmBone =
    character.getObjectByName("mixamorigLeftArm") ||
    character.getObjectByName("mixamorig:LeftArm") ||
    character.getObjectByName("LeftArm") ||
    null;

  const rightArmBone =
    character.getObjectByName("mixamorigRightArm") ||
    character.getObjectByName("mixamorig:RightArm") ||
    character.getObjectByName("RightArm") ||
    null;

  const spineBone =
    character.getObjectByName("mixamorigSpine") ||
    character.getObjectByName("mixamorigSpine1") ||
    character.getObjectByName("mixamorig:Spine") ||
    character.getObjectByName("Spine") ||
    null;

  console.log("[GsapScroll] Bones found:", {
    head: !!headBone,
    neck: !!neckBone,
    leftArm: !!leftArmBone,
    rightArm: !!rightArmBone,
    spine: !!spineBone,
  });

  character.traverse((c) => {
    if ((c as THREE.Object3D).isObject3D) console.log("[GsapScroll] model object:", c.name);
  });

  if (window.innerWidth > 1024) {
    // Force timeline creation on desktop regardless of scroll position
    console.log("[GsapScroll] Desktop detected, creating timelines");
    // TL1: Hero → character moves left smoothly with subtle body sway
    const tl1 = gsap.timeline({
      scrollTrigger: {
        id: "charTL1",
        trigger: ".landing-section",
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl1
      .fromTo(character.rotation, { y: Math.PI }, { y: Math.PI + 0.6, duration: 1 }, 0)
      .to(camera.position, { z: 46 }, 0)
      .fromTo(".character-model", { x: "0%" }, { x: "-20%", duration: 1 }, 0)
      .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
      .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
      .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0)
      // Subtle body sway/bob during scroll
      .fromTo(character.position, { y: 0 }, { y: 0.3, duration: 0.5, ease: "sine.inOut" }, 0)
      .to(character.position, { y: -0.1, duration: 0.5, ease: "sine.inOut" }, 0.5)
      .to(character.position, { y: 0, duration: 0.5, ease: "sine.inOut" }, 1)
      // Pose 1: confident open arms
      if (leftArmBone) tl1.to(leftArmBone.rotation, { x: -0.3, z: 0.7, duration: 0.5 }, 0);
      if (rightArmBone) tl1.to(rightArmBone.rotation, { x: -0.3, z: -0.7, duration: 0.5 }, 0);
      // Pose 2 mid-scroll: arms cross slightly in front
      if (leftArmBone) tl1.to(leftArmBone.rotation, { x: 0.2, z: 0.2, duration: 0.5 }, 0.5);
      if (rightArmBone) tl1.to(rightArmBone.rotation, { x: 0.2, z: -0.2, duration: 0.5 }, 0.5);

    // TL2: About — character stays at -20%, no extra movement
    const tl2 = gsap.timeline({
      scrollTrigger: {
        id: "charTL2",
        trigger: ".about-section",
        start: "top 60%",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl2
      .to(camera.position, { z: 52, y: 6, duration: 6, ease: "power3.inOut" }, 0)
      .to(".about-section", { y: "30%", duration: 6 }, 0)
      .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
      .fromTo(
        ".what-box-in",
        { display: "none" },
        { display: "flex", duration: 0.1, delay: 5 },
        0
      )
      .fromTo(
        ".character-rim",
        { opacity: 1, scaleX: 1.4 },
        { opacity: 0, scale: 0, y: "-70%", duration: 4 },
        0
      );

    if (neckBone) {
      tl2.to(neckBone.rotation, { x: 0.2, duration: 3 }, 0);
    }

    if (headBone) {
      tl2.to(headBone.rotation, { x: 0.1, y: 0.3, duration: 3 }, 0);
      tl2.to(headBone.rotation, { x: 0, y: 0, duration: 3 }, 3);
    }

    if (spineBone) {
      tl2.to(spineBone.rotation, { x: -0.08, duration: 3 }, 0);
      tl2.to(spineBone.rotation, { x: 0, duration: 3 }, 3);
    }

    // Pose 3: thinking pose - hand near chin/face (left arm up, right arm down)
    if (leftArmBone) {
      tl2.to(leftArmBone.rotation, { x: -1.2, z: 0.15, duration: 3 }, 0);
    }
    if (rightArmBone) {
      tl2.to(rightArmBone.rotation, { x: 0.1, z: 0.3, duration: 3 }, 0);
    }

    // TL3: WhatIDo — character snaps back to center
    const tl3 = gsap.timeline({
      scrollTrigger: {
        id: "charTL3",
        trigger: ".whatIDO",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl3
      .to(".character-model", { x: "0%", duration: 3 }, 0)
      .to(character.rotation, { y: Math.PI, x: 0, duration: 2 }, 0)
      .to(".character-model", { opacity: 0, duration: 0 }, 2)
      .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
      .to(headBone?.rotation || {}, { x: 0, y: 0, duration: 1 }, 0)
      .to(neckBone?.rotation || {}, { x: 0, duration: 1 }, 0)
      .to(spineBone?.rotation || {}, { x: 0, duration: 1 }, 0)
      // Pose 4: neutral working pose - arms down, relaxed stance
      .to(".character-model", { opacity: 1, duration: 0 }, 2.5)
      .to(character.position, { x: "5%", duration: 2 }, 2.5)
      .to(character.rotation, { y: Math.PI + 0.3, duration: 2 }, 2.5);

    if (leftArmBone) {
      tl3.to(leftArmBone.rotation, { x: 0.1, z: 0.2, duration: 1 }, 2.5);
    }
    if (rightArmBone) {
      tl3.to(rightArmBone.rotation, { x: 0.1, z: -0.2, duration: 1 }, 2.5);
    }

    // TL4: Career - confident professional pose (hands at sides, slight lean forward)
    const tl4 = gsap.timeline({
      scrollTrigger: {
        id: "charTL4",
        trigger: ".career-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl4
      .to(character.position, { x: "-5%", duration: 2 }, 0)
      .to(character.rotation, { y: Math.PI - 0.4, duration: 2 }, 0)
      .to(spineBone?.rotation || {}, { x: 0.05, duration: 1 }, 0);

    if (leftArmBone) {
      tl4.to(leftArmBone.rotation, { x: 0, y: 0, z: 0.3, duration: 1 }, 0);
    }
    if (rightArmBone) {
      tl4.to(rightArmBone.rotation, { x: 0, y: 0, z: -0.3, duration: 1 }, 0);
    }

    // TL5: Work - pointing/gesturing pose (right arm pointing forward, explaining)
    const tl5 = gsap.timeline({
      scrollTrigger: {
        id: "charTL5",
        trigger: ".work-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl5
      .to(character.position, { x: "0%", duration: 2 }, 0)
      .to(character.rotation, { y: Math.PI, x: 0, duration: 2 }, 0)
      .to(camera.position, { z: 48, duration: 2 }, 0);

    if (leftArmBone) {
      tl5.to(leftArmBone.rotation, { x: -0.5, z: 0.4, duration: 1 }, 0);
    }
    if (rightArmBone) {
      tl5.to(rightArmBone.rotation, { x: -0.4, z: 0.6, duration: 1 }, 0);
    }
    if (headBone) {
      tl5.to(headBone.rotation, { y: -0.2, duration: 1 }, 0.5);
    }

    // TL6: TechStack - explaining/teaching pose (arms open, welcoming gesture)
    const tl6 = gsap.timeline({
      scrollTrigger: {
        id: "charTL6",
        trigger: ".techstack-new",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl6
      .to(character.position, { x: "5%", duration: 2 }, 0)
      .to(character.rotation, { y: Math.PI + 0.5, duration: 2 }, 0);

    if (leftArmBone) {
      tl6.to(leftArmBone.rotation, { x: -0.8, z: 0.8, duration: 1 }, 0);
    }
    if (rightArmBone) {
      tl6.to(rightArmBone.rotation, { x: -0.8, z: -0.8, duration: 1 }, 0);
    }
    if (spineBone) {
      tl6.to(spineBone.rotation, { x: 0.1, duration: 1 }, 0);
    }

    // TL7: CallToAction - inviting gesture (arms reaching forward)
    const tl7 = gsap.timeline({
      scrollTrigger: {
        id: "charTL7",
        trigger: ".cta-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl7
      .to(character.position, { x: "-5%", duration: 2 }, 0)
      .to(character.rotation, { y: Math.PI - 0.5, duration: 2 }, 0)
      .to(camera.position, { z: 50, duration: 2 }, 0);

    if (leftArmBone) {
      tl7.to(leftArmBone.rotation, { x: -0.6, z: 0.9, duration: 1 }, 0);
    }
    if (rightArmBone) {
      tl7.to(rightArmBone.rotation, { x: -0.6, z: -0.9, duration: 1 }, 0);
    }

    // TL8: Contact - waving goodbye pose (right arm waving)
    const tl8 = gsap.timeline({
      scrollTrigger: {
        id: "charTL8",
        trigger: ".contact-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl8
      .to(character.position, { x: "0%", duration: 2 }, 0)
      .to(character.rotation, { y: Math.PI, duration: 2 }, 0)
      .to(camera.position, { z: 46, y: 0, duration: 2 }, 0);

    if (leftArmBone) {
      tl8.to(leftArmBone.rotation, { x: 0.1, z: 0.3, duration: 1 }, 0);
    }
    if (rightArmBone) {
      tl8.to(rightArmBone.rotation, { x: -0.3, z: -0.8, duration: 1 }, 0);
    }
    if (headBone) {
      tl8.to(headBone.rotation, { y: 0.2, duration: 1 }, 0.3);
    }
  } else {
    // Mobile: just show WhatIDo panel
    gsap.timeline({
      scrollTrigger: {
        trigger: ".what-box-in",
        start: "top 70%",
        end: "bottom top",
      },
    }).to(".what-box-in", { display: "flex", duration: 0.1 });
  }

  console.log("[GsapScroll] All timelines created, refreshing...");
  ScrollTrigger.refresh();
}

export function setAllTimeline() {
  // Kill existing career timeline
  ScrollTrigger.getAll()
    .filter((t) => t.vars.id === "careerTL")
    .forEach((t) => t.kill());

  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      id: "careerTL",
      trigger: ".career-section",
      start: "top 50%",
      end: "bottom 30%",
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });

  careerTimeline
    .fromTo(".career-timeline", { maxHeight: "0%" }, { maxHeight: "100%", duration: 1, ease: "none" }, 0)
    .fromTo(".career-timeline", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0)
    .fromTo(".career-info-box", { opacity: 0 }, { opacity: 1, stagger: 0.1, duration: 0.5 }, 0)
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      { animationIterationCount: "1", delay: 0.3, duration: 0.1 },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(".career-section", { y: 0 }, { y: "20%", duration: 0.5, delay: 0.2 }, 0);
  }
}