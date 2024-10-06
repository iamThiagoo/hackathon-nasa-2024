import * as THREE from 'three';

// Geometria e material do asteroide
const geometry = new THREE.DodecahedronGeometry(0.1, 1);
export const radiusFromCenter = 5;
distortGeometry(geometry);

// Utilize a função getRandomColor para definir a cor do material do asteroide
const material = new THREE.MeshBasicMaterial({
    color: getRandomColor(), // A cor agora é aleatória
    roughness: 0.8,
    metalness: 0.2
});

export const asteroid = new THREE.Mesh(geometry, material);
asteroid.position.set(10, 0, 0);
asteroid.castShadow = true;
asteroid.receiveShadow = true;

let asteroidOrbitRadius = 20;
let asteroidAngle = 0;

export function animateAsteroid() {
    // Posição da Terra (substitua por sua posição da Terra, se necessário)
    asteroidAngle += 0.001;
    const earthDistance = 20;
    
    // Calcula a nova posição do asteroide usando seno e cosseno
    const x = (radiusFromCenter + earthDistance) * Math.cos(asteroidAngle);
    const z = (radiusFromCenter + earthDistance) * Math.sin(asteroidAngle);
    asteroid.position.set(x, 0, z);
}

function getRandomColor() {
    const colors = [
        0xCCCCCC, // Cor cinza claro
        0x8B4513, // Cor marrom
        0x8B0000, // Cor vermelho escuro
        0x8B008B, // Cor roxo escuro
        0x8B3E2F, // Cor marrom avermelhado
        0x8B5A2B, // Cor marrom oliva
        0x8B7D6B, // Cor cinza escuro
        0x8B008B, // Cor roxo escuro (duplicada, pode ser removida)
    ];

    // Retorna uma cor aleatória da lista'
    return new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
}

function distortGeometry(geometry) {
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        const noise = Math.random() * 0.05; // Aumenta a intensidade do ruído
        vertex.addScaledVector(vertex.normalize(), noise);

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();
}