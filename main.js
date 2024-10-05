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
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Camera
export const camera = new PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 20;
camera.position.set(30 * Math.cos(Math.PI / 6), 30 * Math.sin(Math.PI / 6), 40);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

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
controls.minDistance = 10;
controls.maxDistance = 60;

renderer.render(scene, camera);


export const earthObject = new NEObject(0, 'Earth', 12756, 'adsad asd ad', 0, 1666, 'terra.jpg', 0, 0);
const moonObject = new NEObject(1, "Moon", 3474, " asdadas asdsad", 0, 3670, 'moon.jpeg', 15, 0)

let objects = [earthObject, moonObject];

for (let object of objects) {
  const sceneObject = object.sceneObject;
  scene.add(sceneObject);

  const orbit = object.orbit;
  console.log(orbit);
  scene.add(orbit);
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
  // planet.rotation.y += 0.005;

  renderer.render(scene,camera);
};

camera.position.z = 500;
createParticles();
animate();

// API


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('test').addEventListener(("click"), () => {
        getDados();
    })
});

function teste(){
    getDados();

}