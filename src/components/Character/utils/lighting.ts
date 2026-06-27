import * as THREE from "three";
import { RGBELoader } from "three-stdlib";
import { gsap } from "gsap";

const setLighting = (scene: THREE.Scene) => {
  // Strong ambient so Soldier mesh is visible from the start
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Key light — purple/white from the front-left
  const keyLight = new THREE.DirectionalLight(0xd4b8ff, 0);
  keyLight.position.set(-2, 5, 4);
  scene.add(keyLight);

  // Rim light — purple from behind for that cyberpunk edge glow
  const rimLight = new THREE.DirectionalLight(0xc2a4ff, 0);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);

  // Fill light — soft white from right
  const fillLight = new THREE.DirectionalLight(0xffffff, 0);
  fillLight.position.set(3, 2, 3);
  scene.add(fillLight);

  // Point light for screen glow effect
  const pointLight = new THREE.PointLight(0xc2a4ff, 0, 20, 2);
  pointLight.position.set(0, 5, 3);
  scene.add(pointLight);

  // Load HDR environment
  try {
    new RGBELoader().setPath("/models/").load("char_enviorment.hdr", (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.environmentIntensity = 0;
    });
  } catch (_) { /* HDR optional */ }

  function setPointLight(_screenLight: THREE.Object3D | null) {
    // Subtle pulse — handled by gsap in turnOnLights
  }

  function turnOnLights() {
    const dur = 2;
    const ease = "power2.inOut";
    gsap.to(ambientLight, { intensity: 1.2, duration: dur, ease });
    gsap.to(keyLight, { intensity: 1.5, duration: dur, ease });
    gsap.to(rimLight, { intensity: 2.0, duration: dur, ease });
    gsap.to(fillLight, { intensity: 0.8, duration: dur, ease });
    gsap.to(pointLight, { intensity: 1.5, duration: dur, ease });
    gsap.to(scene, { environmentIntensity: 0.5, duration: dur, ease });
    gsap.to(".character-rim", { y: "55%", opacity: 1, delay: 0.2, duration: 2 });
  }

  return { setPointLight, turnOnLights };
};

export default setLighting;
