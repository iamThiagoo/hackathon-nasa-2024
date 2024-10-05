import * as THREE from 'three';
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { planet } from './src/earth';
import { velocity, friction, defaultRotationXVelocity } from './src/events-physics.js';

const w = window.innerWidth;
const h = window.innerHeight;

// Scene
const scene = new Scene();

// Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera
const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 20;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 60;

renderer.render(scene, camera);

// Add to scene
scene.add(planet);

// Resize (zoom in/out) event
window.addEventListener("resize", () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

// Animation
const animate = () => {
  requestAnimationFrame(animate);

  // Aplica inércia (desaceleração suave)
  if (velocity.x > defaultRotationXVelocity) {
    velocity.x *= friction;
  }
  velocity.y *= friction;

  // Atualiza a rotação do planeta com base na velocidade do mouse
  planet.rotation.y += velocity.x;
  planet.rotation.x += velocity.y;

  // Atualiza os controles de órbita
  controls.update();

  // Renderiza a cena
  renderer.render(scene, camera);
};

animate();