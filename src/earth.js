import * as THREE from 'three';

const geometry = new THREE.SphereGeometry(5, 32, 32);
const material = new THREE.MeshBasicMaterial({color: 0x0077ff, wireframe: true});

export const planet = new THREE.Mesh(geometry, material);

