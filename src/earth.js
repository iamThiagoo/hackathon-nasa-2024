import * as THREE from 'three';

const geometry = new THREE.SphereGeometry(5, 32, 32);

const textureEarth = new THREE.TextureLoader();
const starTextureEarth = textureEarth.load('earth.jpg');

const material = new THREE.MeshBasicMaterial({wireframe: false, map: starTextureEarth, transparent: false});

export const planet = new THREE.Mesh(geometry, material);