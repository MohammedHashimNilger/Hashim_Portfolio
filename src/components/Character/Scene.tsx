import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, DRACOLoader, RGBELoader } from "three-stdlib";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { handleMouseMove, handleHeadRotation } from "./utils/mouseUtils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    if (!canvasDiv.current) return;

    // Use window size — more reliable than getBoundingClientRect on mount
    const w = window.innerWidth;
    const h = window.innerHeight;

    console.log("[Scene] canvas size:", w, h);

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio < 2,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // Make canvas fill its parent
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";

    canvasDiv.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, w / h, 0.1, 1000);
    camera.position.set(0, 4.5, 38);
    camera.lookAt(0, 4.5, 0);

    // Load HDR
    try {
      new RGBELoader().setPath("/models/").load("char_enviorment.hdr", (tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = tex;
        scene.environmentIntensity = 0;
      });
    } catch (_) {}

    const light = setLighting(scene);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    const fallback = setTimeout(() => {
      console.log("[Scene] fallback timer fired");
      setLoading(100);
    }, 10000);

    let headBone: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    console.log("[Scene] loading /models/character.glb ...");

    loader.load(
      "/models/character.glb",
      async (gltf) => {
        clearTimeout(fallback);
        console.log("[Scene] GLB loaded!", gltf.scene.children.length, "children");

        const model = gltf.scene;

        // Auto-scale to 9 units tall
        const box = new THREE.Box3().setFromObject(model);
        const height = box.max.y - box.min.y;
        const scale = 9 / height;
        console.log("[Scene] model height:", height, "scale:", scale);
        model.scale.setScalar(scale);

        // Re-center
        const box2 = new THREE.Box3().setFromObject(model);
        model.position.set(
          -(box2.min.x + box2.max.x) / 2,
          -box2.min.y,
          -(box2.min.z + box2.max.z) / 2
        );
        console.log("[Scene] model position:", model.position);

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.frustumCulled = false;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach((m) => {
              const mat = m as THREE.MeshStandardMaterial;
              if (mat.isMeshStandardMaterial) mat.envMapIntensity = 1.2;
            });
          }
        });

        await renderer.compileAsync(model, camera, scene);
        scene.add(model);
        console.log("[Scene] model added to scene");

        headBone = model.getObjectByName("mixamorig:Head") || null;
        console.log("[Scene] headBone:", headBone?.name);

        if (gltf.animations?.length) {
          mixer = new THREE.AnimationMixer(model);
          const idle = gltf.animations.find(a => /idle/i.test(a.name)) || gltf.animations[0];
          // Pause idle so GSAP scroll poses can control bones without being overwritten
          const action = mixer.clipAction(idle);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          action.timeScale = 0;
          console.log("[Scene] mixer paused (timeScale=0), using GSAP poses only:", idle.name);
        }

        setCharTimeline(model, camera);
        setAllTimeline();
        dracoLoader.dispose();

        console.log("[Scene] Timelines set, refreshing ScrollTrigger...");
        ScrollTrigger.refresh();

        setLoading(100);

        setTimeout(() => {
          light.turnOnLights();
          gsap.fromTo(model.rotation, { y: Math.PI - 0.6 }, { y: Math.PI, duration: 1.8, ease: "power3.out" });
        }, 2500);

        const onResize = () => {
          const rw = window.innerWidth;
          const rh = window.innerHeight;
          renderer.setSize(rw, rh);
          camera.aspect = rw / rh;
          camera.updateProjectionMatrix();
          ScrollTrigger.getAll()
            .filter(t => ["charTL1","charTL2","charTL3"].includes(t.vars.id as string))
            .forEach(t => t.kill());
          setCharTimeline(model, camera);
        };
        window.addEventListener("resize", onResize);
      },
      (progress) => {
        if (progress.total > 0) {
          console.log("[Scene] loading:", Math.round(progress.loaded / progress.total * 100) + "%");
        }
      },
      (err) => {
        clearTimeout(fallback);
        console.error("[Scene] GLB load error:", err);
        setLoading(100);
      }
    );

    let mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) =>
      handleMouseMove(e, (x, y) => (mouse = { x, y }));
    document.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (headBone) handleHeadRotation(headBone, mouse.x, mouse.y, 0.08, 0.12, THREE.MathUtils.lerp);
      if (mixer) mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallback);
      renderer.dispose();
      document.removeEventListener("mousemove", onMouseMove);
      scene.clear();
      if (canvasDiv.current?.contains(renderer.domElement))
        canvasDiv.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className="character-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 11,
        pointerEvents: "none",
      }}
    >
      <div
        className="character-model"
        ref={canvasDiv}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <div className="character-rim"></div>
      </div>
    </div>
  );
};

export default Scene;
