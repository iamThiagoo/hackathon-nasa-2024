import * as THREE from "three";
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getAsteroids } from "./src/api/api";
import { NEObject, sunSimulatedDiameter } from "./src/objects.js";
import { target } from "./src/modal.js";
import { getCurrentDate } from "./src/utils/date.js";

let w = window.innerWidth;
let h = window.innerHeight;

// Scene
export const scene = new Scene();

// Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.setSize(w, h);

// Camera
export const camera = new PerspectiveCamera(75, w / h, 0.1, 2000);
camera.position.z = 20;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);
camera.position.z = 500;
const defaultCameraPosition = camera.position.clone();

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 250;

// Variáveis para o mouse e as partículas
let particles;
export const mouse = new THREE.Vector2();
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load("svg/circle.svg");
const particleCount = 30000;
createParticles();

// Objetos
const mercuriObject = new NEObject(
  2,
  "Mercury",
  4880,
  0,
  47.87 * 1000,
  15,
  "mercury.jpg",
  7.0
); // 7.0° de inclinação
const venusObject = new NEObject(
  3,
  "Venus",
  12104,
  0,
  35.02 * 1000,
  20,
  "venus.jpg",
  3.39
); // 3.39° de inclinação
export const earthObject = new NEObject(
  4,
  "Earth",
  12756,
  0,
  29.78 * 1000,
  25,
  "earth.jpg",
  0.0
); // 0.0° de inclinação
const moonObject = new NEObject(
  5,
  "Moon",
  3474,
  0,
  29.78 * 1000,
  27,
  "moon.jpg",
  0.0
); // 6.68° de inclinação em relação à Terra
const marteObject = new NEObject(
  6,
  "Mars",
  6779,
  0,
  24.077 * 1000,
  40,
  "mars.jpg",
  25.19
); // 25.19° de inclinação
const jupiterObject = new NEObject(
  7,
  "Jupiter",
  139820,
  0,
  13.07 * 1000,
  60,
  "jupiter.jpg",
  3.13
); // 3.13° de inclinação
const saturnoObject = new NEObject(
  8,
  "Saturn",
  116460,
  0,
  9.69 * 1000,
  90,
  "saturn.jpg",
  26.73
); // 26.73° de inclinação
const uranoObject = new NEObject(
  9,
  "Uranus",
  50724,
  0,
  6.81 * 1000,
  130,
  "uranus.jpg",
  0.77
); // 0.77° de inclinação
const netunoObject = new NEObject(
  10,
  "Neptune",
  49244,
  0,
  5.43 * 1000,
  160,
  "neptune.jpg",
  1.76
); // 1.76° de inclinação

let objects = [
  earthObject,
  moonObject,
  mercuriObject,
  venusObject,
  marteObject,
  jupiterObject,
  saturnoObject,
  uranoObject,
  netunoObject,
];

const asteroids = await getAsteroids();

const dados = asteroids.data.near_earth_objects;
dados[getCurrentDate()] = dados[getCurrentDate()].slice(0, 15);

let j = 30;
for (let i = 0; i < dados[getCurrentDate()].length; i++) {
  let dado = dados[getCurrentDate()][i];
  const diameter =
    (dado.estimated_diameter.kilometers.estimated_diameter_max +
      dado.estimated_diameter.kilometers.estimated_diameter_min) /
    2;
  const velocity =
    dado.close_approach_data[0].relative_velocity.kilometers_per_hour / 10;
  const distance = dado.close_approach_data[0].miss_distance.kilometers;
  const asteroideObject = new NEObject(
    dado.id,
    dado.name,
    17370,
    0,
    velocity,
    Math.floor(Math.random() * (160 - 50) + 50),
    "moon.jpg",
    Math.floor(Math.random() * (90 - -90) + -90),
    true
  );

  objects.push(asteroideObject);
  j += 5;
}

earthObject.sceneObject.receiveShadow;

for (let object of objects) {
  const sceneObject = object.sceneObject;
  scene.add(sceneObject);

  if (!object.isAsteroid) {
    scene.add(object.orbit);
  }
}

setTimeout(() => {
  document.getElementById("loader").style.display = "none";
}, 1000);

// Resize (zoom in/out) event
window.addEventListener("resize", () => {
  w = window.innerWidth;
  h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

const tooltips = {};

function createTooltip(object) {
  const tooltip = document.createElement("div");
  tooltip.style.position = "absolute";
  tooltip.style.background = "rgba(0, 0, 0, 0.7)";
  tooltip.style.color = "white";
  tooltip.style.padding = "5px";
  tooltip.style.borderRadius = "5px";
  tooltip.style.pointerEvents = "none";
  tooltip.innerText = object.name;
  tooltip.id = object.name;

  document.body.appendChild(tooltip);
  tooltips[object.id] = tooltip;
}

objects.forEach((object) => {
  createTooltip(object);
});

function updateTooltips() {
  objects.forEach((object) => {
    const vector = new THREE.Vector3();

    object.sceneObject.getWorldPosition(vector);
    vector.y += 10;
    vector.project(camera);

    const widthHalf = window.innerWidth / 2;
    const heightHalf = window.innerHeight / 2;

    const x = vector.x * widthHalf + widthHalf;
    const y = -(vector.y * heightHalf) + heightHalf;

    const tooltip = tooltips[object.id];
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });
}

// API
document.addEventListener("DOMContentLoaded", async function () {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
  }, 1000);
});

let sun;

function createSun() {
  const geometry = new THREE.SphereGeometry(sunSimulatedDiameter, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    map: textureLoader.load("img/sun.jpg"),
  });

  // Inicializar a variável 'sun' aqui
  sun = new THREE.Mesh(geometry, material);
  sun.name = "Sun";
  scene.add(sun);

  return sun;
}

createSun();

// Função para criar o sistema de partículas
function createParticles() {
  const geometry = new THREE.BufferGeometry();
  const positions = [];

  // Criar várias partículas aleatórias
  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 800; // Posição x aleatória
    const y = (Math.random() - 0.5) * 800; // Posição y aleatória
    const z = (Math.random() - 0.5) * 800; // Posição z aleatória
    positions.push(x, y, z); // Adicionando a posição da partícula
  }

  // Atribuir as posições ao BufferGeometry
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  // Material para as partículas
  const material = new THREE.PointsMaterial({
    map: starTexture, // Definindo a textura da estrela
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    depthTest: false,
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

  updateTooltips();

  // Girar o sol
  if (sun) {
    sun.rotation.y += 0.001;
  }

  if (target) {
    let distance = 15;

    // Atualiza a posição da câmera para acompanhar o objeto
    const targetPosition = new THREE.Vector3();
    target.getWorldPosition(targetPosition);

    // Ajuste a posição da câmera
    camera.position.x = targetPosition.x;
    camera.position.y = targetPosition.y;
    camera.position.z = targetPosition.z + distance; // Mova a câmera para trás
    camera.lookAt(targetPosition); // Faz a câmera olhar para o objeto
  }

  controls.update();
  renderer.render(scene, camera);
}

export function resetCameraPosition() {
  // target = null;
  camera.position.copy(defaultCameraPosition);
  camera.lookAt(0, 0, 0);
}

// Render final
renderer.render(scene, camera);
animate();
