import * as THREE from "three";
import { STAR_FIELD_COUNT, SUN_SIMULATED_DIAMETER } from "./constants.js";

const textureLoader = new THREE.TextureLoader();

export function createSun() {
  const geometry = new THREE.SphereGeometry(SUN_SIMULATED_DIAMETER, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load("/img/sun.jpg"),
  });

  const sun = new THREE.Mesh(geometry, material);
  sun.name = "Sun";
  sun.userData.objectType = "body";

  return sun;
}

export function createStarField(count = STAR_FIELD_COUNT) {
  const positions = [];

  for (let index = 0; index < count; index += 1) {
    positions.push(
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800,
      (Math.random() - 0.5) * 800
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    depthTest: false,
    map: textureLoader.load("/svg/circle.svg"),
    size: 0.5,
    transparent: true,
  });

  const particles = new THREE.Points(geometry, material);
  particles.isStar = true;
  particles.userData.objectType = "star-field";

  return particles;
}
