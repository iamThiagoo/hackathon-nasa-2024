import * as THREE from 'three';
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getDados } from './src/api/api';
import { NEObject } from './src/objects.js';

const w = window.innerWidth;
const h = window.innerHeight;

// Scene
export const scene = new Scene();

// Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setSize(w, h);

// Camera
export const camera = new PerspectiveCamera(75, w / h, 0.1, 500);
camera.position.z = 20;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);
camera.position.z = 500;

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 100;

// Variáveis para o mouse e as partículas
let particles;
export const mouse = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('circle.svg');
const particleCount = 30000;

renderer.render(scene, camera);

export const earth = new NEObject(
  0,
  'Earth',
  12756,
  'adsad asd ad',
  1666,
  3700,
  0,
  false,
  'earth.jpg',
  true
);

const moon = new NEObject(
  1,
  "Moon",
  3474,
  " asdadas asdsad",
  3670,
  3700,
  384400,
  false,
  'moon.jpg'
);

export let objects = [earth, moon];

for (let object of objects) {
  object.setOrbit();
  scene.add(object.sceneObject);
  scene.add(object.orbit);
}

// Render final
renderer.render(scene, camera);
animate();

// Resize (zoom in/out) event
window.addEventListener("resize", () => {
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

// API
document.addEventListener("DOMContentLoaded", async function() {
  const asteroids = await getDados();

  document.getElementById('loader').style.display = 'none';
  asteroids.forEach(asteroid => {
      const sceneObject = asteroid.sceneObject;
      scene.add(sceneObject);

      const orbit = asteroid.orbit;
      scene.add(orbit);
    }
  )
});

// Função para criar o sistema de partículas
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  // Criar várias partículas aleatórias
  for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 800;  // Posição x aleatória
      const y = (Math.random() - 0.5) * 800;  // Posição y aleatória
      const z = (Math.random() - 0.5) * 800;  // Posição z aleatória
      positions.push(x, y, z);  // Adicionando a posição da partícula
  }

  // Atribuir as posições ao BufferGeometry
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  // Material para as partículas
  const material = new THREE.PointsMaterial({
      map: starTexture,  // Definindo a textura da estrela
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      depthTest: false
  });

  // Criar sistema de partículas
  particles = new THREE.Points(geometry, material);
  particles.isStar = true;
  scene.add(particles);
}

// Animation
function animate() {
  requestAnimationFrame(animate);

  for (let object of objects) {
    object.animate();
  }

  controls.update();
  renderer.render(scene, camera);
  controls.update();
};

camera.position.z = 500;
createParticles();
animate();

// API
document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById('test').addEventListener(("click"), async () => {
    getDados();
    console.log(await sendMessage('olá, tudo bem?'));
  })
});

