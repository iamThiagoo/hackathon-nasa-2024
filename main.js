import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criando a geometria do planeta (esfera)
const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({color: 0x0077ff, wireframe: false});
const planet = new THREE.Mesh(geometry, material);

// Adiciona o planeta à cena
scene.add(planet);
camera.position.z = 20;

// Função de renderização
function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.01; // Rotação do planeta
    renderer.render(scene, camera);
}
animate();