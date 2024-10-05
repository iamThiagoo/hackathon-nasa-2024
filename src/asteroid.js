import * as THREE from 'three'

// Geometria e material do asteroide
const geometry = new THREE.SphereGeometry(0.1, 16, 16);
const material = new THREE.MeshStandardMaterial({
    color: 0xCCCCCC,
    roughness: 0.1,
    metalness: 0.1
});

const asteroid = new THREE.Mesh(geometry, material);
asteroid.position.set(10, 0, 0);

distortGeometry(geometry);

function distortGeometry(geometry) {
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        const noise = Math.random() * 1;
        vertex.addScaledVector(vertex.normalize(), noise);

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();
}

export default asteroid;