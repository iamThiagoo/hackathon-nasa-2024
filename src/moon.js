import * as THREE from 'three';

const geometry = new THREE.SphereGeometry(2,16,16);

const textureMoon = new THREE.TextureLoader();
const starTextureMoon = textureMoon.load('moon.jpeg');

const material = new THREE.MeshBasicMaterial({wireframe: false, map: starTextureMoon, transparent: true});

export const moon = new THREE.Mesh(geometry,material);

moon.position.set(5,5,-15);

