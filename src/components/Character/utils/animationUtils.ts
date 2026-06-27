import * as THREE from "three";
import { type GLTF } from "three-stdlib";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);

  // Start with Idle animation looping
  const idleClip =
    gltf.animations.find((c) => c.name === "Idle") ||
    gltf.animations.find((c) => c.name === "Standing") ||
    gltf.animations[0];

  let currentAction: THREE.AnimationAction | null = null;

  if (idleClip) {
    currentAction = mixer.clipAction(idleClip);
    currentAction.setLoop(THREE.LoopRepeat, Infinity);
    currentAction.play();
  }

  function startIntro() {
    // Wave once, then back to Idle
    const waveClip = gltf.animations.find((c) => c.name === "Wave");
    if (waveClip && currentAction) {
      const waveAction = mixer.clipAction(waveClip);
      waveAction.setLoop(THREE.LoopOnce, 1);
      waveAction.clampWhenFinished = true;
      waveAction.reset();
      currentAction.crossFadeTo(waveAction, 0.5, false);
      waveAction.play();

      // After wave done, cross back to idle
      mixer.addEventListener("finished", (e) => {
        if (e.action === waveAction && currentAction) {
          waveAction.crossFadeTo(currentAction, 0.5, false);
          currentAction.play();
        }
      });
    }
  }

  function hover(_gltf: GLTF, _hoverDiv: HTMLDivElement) {
    // ThumbsUp on hover if available
    const thumbClip = gltf.animations.find((c) => c.name === "ThumbsUp");
    if (!thumbClip || !currentAction || !_hoverDiv) return;

    const thumbAction = mixer.clipAction(thumbClip);
    thumbAction.setLoop(THREE.LoopOnce, 1);
    thumbAction.clampWhenFinished = true;

    _hoverDiv.addEventListener("mouseenter", () => {
      thumbAction.reset();
      currentAction!.crossFadeTo(thumbAction, 0.3, false);
      thumbAction.play();
    });
    _hoverDiv.addEventListener("mouseleave", () => {
      thumbAction.crossFadeTo(currentAction!, 0.3, false);
      currentAction!.play();
    });
  }

  return { mixer, startIntro, hover };
};

export default setAnimations;
