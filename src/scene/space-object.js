import * as THREE from "three";
import { ORBIT_VELOCITY_SCALE, PLANET_SCALE } from "./constants.js";

const textureLoader = new THREE.TextureLoader();
const asteroidColors = [
  0xcccccc, 0x8b4513, 0x8b0000, 0x8b008b, 0x8b3e2f, 0x8b5a2b, 0x8b7d6b,
];

function getRandomAsteroidColor() {
  const color =
    asteroidColors[Math.floor(Math.random() * asteroidColors.length)];
  return new THREE.Color(color);
}

function distortGeometry(geometry) {
  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    vertex.addScaledVector(vertex.normalize(), Math.random() * 0.05);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createGeometry(radius, isAsteroid) {
  if (!isAsteroid) {
    return new THREE.SphereGeometry(radius, 32, 32);
  }

  const geometry = new THREE.DodecahedronGeometry(radius, 1);
  distortGeometry(geometry);
  return geometry;
}

function createMaterial({ isAsteroid, textureSource }) {
  if (isAsteroid) {
    return new THREE.MeshBasicMaterial({ color: getRandomAsteroidColor() });
  }

  const texture = textureLoader.load(`/img/${textureSource}`);
  return new THREE.MeshBasicMaterial({ map: texture });
}

export class SpaceObject {
  constructor({
    id,
    name,
    diameter,
    rotationVelocity = 0.01,
    orbitVelocity = 0,
    orbitRadius = 0,
    textureSource,
    inclination = 0,
    isAsteroid = false,
  }) {
    this.id = id;
    this.name = name;
    this.diameter = diameter;
    this.rotationVelocity = rotationVelocity;
    this.orbitVelocity = orbitVelocity;
    this.orbitRadius = orbitRadius;
    this.textureSource = textureSource;
    this.inclination = inclination;
    this.isAsteroid = isAsteroid;
    this.angle = 0;

    this.sceneObject = new THREE.Mesh(
      createGeometry(this.scaledRadius, this.isAsteroid),
      createMaterial({
        isAsteroid: this.isAsteroid,
        textureSource: this.textureSource,
      })
    );

    this.sceneObject.name = this.name;
    this.sceneObject.isAsteroid = this.isAsteroid;
    this.sceneObject.userData.objectType = this.isAsteroid
      ? "asteroid"
      : "body";

    if (this.isAsteroid) {
      this.sceneObject.castShadow = true;
      this.sceneObject.receiveShadow = true;
    }

    this.orbitCurve = this.createOrbitCurve();
    this.orbit = this.isAsteroid ? null : this.createOrbit();
  }

  get scaledRadius() {
    return this.diameter / 2 / PLANET_SCALE;
  }

  createOrbitCurve() {
    const radius = this.orbitRadius + 5;

    return new THREE.EllipseCurve(
      0,
      0,
      radius,
      radius,
      0,
      2 * Math.PI,
      true,
      0
    );
  }

  createOrbit() {
    const points = this.orbitCurve.getPoints(100);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    material.isOrbit = true;

    const orbit = new THREE.Line(geometry, material);
    orbit.rotation.y = THREE.MathUtils.degToRad(this.inclination);

    return orbit;
  }

  animate() {
    this.sceneObject.rotation.y += this.rotationVelocity;
    this.angle += this.orbitVelocity / ORBIT_VELOCITY_SCALE;

    const normalizedAngle = (this.angle / (2 * Math.PI)) % 1;
    const point = this.orbitCurve.getPoint(normalizedAngle);
    const inclinationInRadians = THREE.MathUtils.degToRad(this.inclination);

    const inclinedY = point.y * Math.cos(inclinationInRadians);
    const inclinedZ = point.y * Math.sin(inclinationInRadians);

    this.sceneObject.position.set(point.x, inclinedY, inclinedZ);
  }
}
