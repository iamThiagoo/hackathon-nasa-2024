import * as THREE from 'three';

// Definição da geometria e textura da Lua
const geometry = new THREE.SphereGeometry(2, 16, 16);

const textureMoon = new THREE.TextureLoader();
const starTextureMoon = textureMoon.load('moon.jpeg');

const material = new THREE.MeshBasicMaterial({ wireframe: false, map: starTextureMoon, transparent: false });

export const moon = new THREE.Mesh(geometry, material);

// Posição inicial da Lua
let moonOrbitRadius = 30; // Raio da órbita ao redor da Terra
let moonAngle = 0; // Ângulo inicial da órbita

// Função de animação para movimentar a Lua ao redor da Terra
export function animateMoon() {
    // Atualiza o ângulo da Lua para criar a animação circular
    moonAngle += 0.01; // Velocidade de rotação (ajustável)

    // Posição da Terra (substitua por sua posição da Terra, se necessário)
    const earthPosition = new THREE.Vector3(0, 0, 0);

    // Calcula a nova posição da Lua usando seno e cosseno
    moon.position.x = earthPosition.x + moonOrbitRadius * Math.cos(moonAngle);
    moon.position.z = earthPosition.z + moonOrbitRadius * Math.sin(moonAngle);
    moon.rotation.y += 0.01;

}