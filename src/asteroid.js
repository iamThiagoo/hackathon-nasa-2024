import * as THREE from 'three';

// Geometria e material do asteroide
const geometry = new THREE.DodecahedronGeometry(0.1, 1);
distortGeometry(geometry);

const material = new THREE.MeshStandardMaterial({
    color: getRandomColor(),
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
    asteroidAngle += 0.01;
    
    // Posição da Terra (substitua por sua posição da Terra, se necessário)
    const earthPosition = new THREE.Vector3(0, 0, 0);
    
    // Calcula a nova posição da Lua usando seno e cosseno
    asteroid.position.x = earthPosition.x + asteroidOrbitRadius * Math.cos(asteroidAngle);
    asteroid.position.z = earthPosition.z + asteroidOrbitRadius * Math.sin(asteroidAngle);
    asteroid.rotation.y += 0.01;
}

function getRandomColor() {
    const colors = [
        '0xCCCCC',
        '0x8B4513',
        '0x8B0000',
        '0x8B008B',
        '0x8B3E2F',
        '0x8B5A2B',
        '0x8B7D6B',
        '0x8B008B',
    ];

    return colors[Math.floor(Math.random() * colors.length)];
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