import * as THREE from "three";

/**
 * Builds a procedural Iron Man suit from Three.js primitives.
 * Gold/red colour scheme, glowing arc reactor, articulated limbs.
 */
export function buildIronMan(scene: THREE.Scene): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const red = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.3, metalness: 0.85 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.25, metalness: 0.9 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6, metalness: 0.5 });
  const glow = new THREE.MeshStandardMaterial({ color: 0x88ddff, emissive: 0x44aaff, emissiveIntensity: 3, roughness: 0.1, metalness: 0.0 });
  const eyeGlow = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffeedd, emissiveIntensity: 5, roughness: 0.0, metalness: 0.0 });

  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, x=0, y=0, z=0, rx=0, ry=0, rz=0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx, ry, rz);
    return m;
  };

  // ── HEAD ──
  const head = new THREE.Group();
  head.position.set(0, 8.2, 0);
  // Helmet base
  head.add(mesh(new THREE.SphereGeometry(0.72, 16, 12), red));
  // Faceplate — slightly larger ellipse on front
  const face = mesh(new THREE.SphereGeometry(0.65, 16, 12), gold, 0, -0.05, 0.38);
  face.scale.set(0.85, 0.78, 0.5);
  head.add(face);
  // Eyes
  head.add(mesh(new THREE.EllipseCurve ? new THREE.SphereGeometry(0.1, 8, 6) : new THREE.SphereGeometry(0.1), eyeGlow, -0.22, 0.1, 0.62));
  head.add(mesh(new THREE.SphereGeometry(0.1, 8, 6), eyeGlow, 0.22, 0.1, 0.62));
  // Chin piece
  const chin = mesh(new THREE.BoxGeometry(0.8, 0.22, 0.55), gold, 0, -0.42, 0.22);
  chin.rotation.x = -0.3;
  head.add(chin);
  group.add(head);

  // ── NECK ──
  group.add(mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.4, 10), dark, 0, 7.75, 0));

  // ── TORSO ──
  const torso = new THREE.Group();
  torso.position.set(0, 6.5, 0);
  // Chest
  const chest = mesh(new THREE.BoxGeometry(1.9, 2.1, 1.1), red);
  chest.scale.set(1, 1, 1);
  torso.add(chest);
  // Chest centre plate (gold)
  torso.add(mesh(new THREE.BoxGeometry(0.8, 1.4, 0.1), gold, 0, 0.1, 0.56));
  // Arc reactor
  torso.add(mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.12, 16), glow, 0, 0.35, 0.57));
  torso.add(mesh(new THREE.TorusGeometry(0.22, 0.05, 8, 16), gold, 0, 0.35, 0.57));
  // Abs / belly
  const belly = mesh(new THREE.BoxGeometry(1.7, 0.9, 0.95), dark, 0, -1.15, 0);
  torso.add(belly);
  // Gold ribs
  for (let i = 0; i < 3; i++) {
    torso.add(mesh(new THREE.BoxGeometry(1.5, 0.08, 0.05), gold, 0, -0.75 - i * 0.28, 0.5));
  }
  group.add(torso);

  // ── SHOULDERS ──
  [[-1.2, 0], [1.2, 0]].forEach(([sx]) => {
    const sh = new THREE.Group();
    sh.position.set(sx, 7.2, 0);
    sh.add(mesh(new THREE.SphereGeometry(0.42, 12, 8), gold));
    group.add(sh);
  });

  // ── ARMS ──
  const makeArm = (side: number) => {
    const arm = new THREE.Group();
    arm.position.set(side * 1.3, 6.5, 0);
    // Upper arm
    arm.add(mesh(new THREE.CylinderGeometry(0.25, 0.22, 1.4, 10), red, 0, 0, 0));
    // Elbow joint
    arm.add(mesh(new THREE.SphereGeometry(0.24, 10, 8), gold, 0, -0.78, 0));
    // Forearm
    arm.add(mesh(new THREE.CylinderGeometry(0.2, 0.18, 1.2, 10), red, 0, -1.5, 0));
    // Gold forearm plate
    arm.add(mesh(new THREE.BoxGeometry(0.28, 0.8, 0.1), gold, side * 0.15, -1.45, 0.2));
    // Wrist
    arm.add(mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.22, 10), gold, 0, -2.22, 0));
    // Repulsor (palm glow)
    arm.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), glow, 0, -2.55, 0));
    // Hand fist
    arm.add(mesh(new THREE.BoxGeometry(0.32, 0.3, 0.36), red, 0, -2.8, 0));
    return arm;
  };
  group.add(makeArm(-1));
  group.add(makeArm(1));

  // ── HIPS / WAIST ──
  group.add(mesh(new THREE.BoxGeometry(1.6, 0.45, 0.9), gold, 0, 5.45, 0));

  // ── LEGS ──
  const makeLeg = (side: number) => {
    const leg = new THREE.Group();
    leg.position.set(side * 0.5, 5.0, 0);
    // Hip socket
    leg.add(mesh(new THREE.SphereGeometry(0.3, 10, 8), gold, 0, 0.1, 0));
    // Upper leg
    leg.add(mesh(new THREE.CylinderGeometry(0.3, 0.26, 1.7, 10), red, 0, -0.96, 0));
    // Knee cap
    leg.add(mesh(new THREE.SphereGeometry(0.27, 10, 8), gold, 0, -1.92, 0));
    // Lower leg
    leg.add(mesh(new THREE.CylinderGeometry(0.23, 0.28, 1.6, 10), red, 0, -2.85, 0));
    // Gold shin plate
    leg.add(mesh(new THREE.BoxGeometry(0.32, 1.0, 0.1), gold, 0, -2.8, 0.26));
    // Ankle
    leg.add(mesh(new THREE.SphereGeometry(0.24, 10, 8), dark, 0, -3.72, 0));
    // Boot
    leg.add(mesh(new THREE.BoxGeometry(0.52, 0.42, 0.85), red, 0, -4.1, 0.12));
    // Boot toe
    const toe = mesh(new THREE.BoxGeometry(0.46, 0.28, 0.45), gold, 0, -4.22, 0.52);
    toe.rotation.x = -0.2;
    leg.add(toe);
    // Boot repulsor
    leg.add(mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.06, 12), glow, 0, -4.42, 0.14));
    return leg;
  };
  group.add(makeLeg(-1));
  group.add(makeLeg(1));

  // Position whole group — feet at y=0
  group.position.set(0, 4.5, 0);

  scene.add(group);
  return group;
}
