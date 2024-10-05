import * as THREE from 'three';
import { Scene, WebGLRenderer, PerspectiveCamera } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { planet } from './src/earth';

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


// Variáveis para o mouse e as partículas
let particles;
const mouse = new THREE.Vector2();
const particleCount = 2000;
const particleDistance = 10;

// Carregar a textura da estrela
const textureLoader = new THREE.TextureLoader();
const starTexture = textureLoader.load('star.svg');

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
        size: 2,
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

  // Anima as partículas para que algumas delas se conectem
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
        let dx = positions[i] - mouse.x * 100;
        let dy = positions[i + 1] - mouse.y * 100;
        let dz = positions[i + 2];
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < particleDistance) {
            // Simulação de conexão das partículas dentro de um raio de "particleDistance"
            // Aqui você pode desenhar linhas entre partículas se desejar, ou alterar a cor
        }
    }


  controls.update();
  planet.rotation.y += 0.01;
  renderer.render(scene, camera);
};

camera.position.z = 500;
createParticles();
animate();