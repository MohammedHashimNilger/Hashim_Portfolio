import * as THREE from "three";
import { DRACOLoader, type GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>((resolve, reject) => {
      loader.load(
        "/models/character.glb",
        async (gltf) => {
          const character = gltf.scene;

          // Compute bounding box BEFORE any transforms
          const box = new THREE.Box3().setFromObject(character);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);

          // Scale so character is exactly 9 units tall (fits a narrow-FOV camera well)
          const targetHeight = 9;
          const scaleFactor = targetHeight / size.y;
          character.scale.setScalar(scaleFactor);

          // After scaling, recompute bottom and center
          const scaledBox = new THREE.Box3().setFromObject(character);
          const scaledBottom = scaledBox.min.y;
          const scaledCenter = new THREE.Vector3();
          scaledBox.getCenter(scaledCenter);

          // Feet at y=0, centered on X/Z
          character.position.set(
            -scaledCenter.x,
            -scaledBottom,
            -scaledCenter.z
          );

          await renderer.compileAsync(character, camera, scene);

          character.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.castShadow = false;
              mesh.receiveShadow = false;
              mesh.frustumCulled = false;
            }
          });

          setCharTimeline(character, camera);
          setAllTimeline();
          dracoLoader.dispose();
          resolve(gltf);
        },
        undefined,
        (error) => {
          console.error("GLB load error:", error);
          reject(error);
        }
      );
    });
  };

  return { loadCharacter };
};

export default setCharacter;
