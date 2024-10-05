import * as THREE from 'three';

// Criando a geometria do planeta (esfera)
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({color: 0x0077ff, wireframe: true});
const planet = new THREE.Mesh(geometry, material);


import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new Scene();
const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
const renderer = new WebGLRenderer({ antialias: true });
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 10;
controls.maxDistance = 60;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

camera.position.z = 20;
scene.add(planet);
renderer.setSize(w, h);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);

window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  planet.rotation.y += 0.01;
  renderer.render(scene, camera);
};

animate();