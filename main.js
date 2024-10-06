import * as THREE from 'three';
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getDados } from './src/api/api';
import { NEObject } from './src/objects.js';
import { sendMessage } from './src/api/openai.js';

const w = window.innerWidth;
const h = window.innerHeight;

// Scene
export const scene = new Scene();

// Renderer
const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera
export const camera = new PerspectiveCamera(75, w / h, 0.1, 500);
camera.position.z = 20;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.minDistance = 10;
controls.maxDistance = 100;

// Variáveis para o mouse e as partículas
let particles;
export const mouse = new THREE.Vector2();
const particleCount = 30000;

// Carregar a textura da estrela
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('circle.svg');

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
  scene.add(particles);
}

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
  'moon.jpeg'
);

const testAsteroid = new NEObject(
  2,
  "Asteroid",
  3474 / 2,
  "Teste",
  3670 * 2,
  7400,
  384400 * 0.4,
  true
);

function orbitarEmTornoDaTerra(deltaTime) {
  // Encontrar a posição do objeto Earth
  let earth = null;
  objetos.forEach((objeto) => {
      if (objeto.isEarth) {
          earth = objeto;
      }
  });

  // Se a Terra for encontrada
  if (earth) {
      // Posiciona a origem da órbita na posição da Terra
      const earthPosition = earth.position;

      // Agora aplicamos a órbita nos outros objetos
      objetos.forEach((objeto) => {
          if (!objeto.isEarth) { // Somente objetos que NÃO são a Terra
              const velocidadeOrbital = 0.001; // Ajuste a velocidade da órbita
              const raioOrbita = objeto.position.distanceTo(earthPosition); // Distância entre objeto e Terra

              // Calcular ângulo de rotação baseado no tempo
              const angulo = velocidadeOrbital * deltaTime;

              // Atualiza a posição para a órbita
              objeto.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), angulo); // Rotação em torno do eixo Y

              // Reposiciona com base na distância do centro (para manter o raio da órbita constante)
              const direcao = objeto.position.clone().sub(earthPosition).normalize();
              objeto.position.copy(earthPosition).add(direcao.multiplyScalar(raioOrbita));
          }
      });
  }
}

export let objects = [earth, moon, testAsteroid];

earth.sceneObject.receiveShadow;

for (let object of objects) {
  object.setOrbit();
  scene.add(object.sceneObject);
  scene.add(object.orbit);
}

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

  for (let object of objects) {
    object.animate();
  }

  // Atualiza os controles de órbita
  controls.update();

  // Renderiza a cena
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

function teste() {
  getDados();
}