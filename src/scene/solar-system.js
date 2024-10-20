import { PLANET_DEFINITIONS } from "../data/celestial-bodies.js";
import { ASTEROID_SCENE_DIAMETER } from "./constants.js";
import { SpaceObject } from "./space-object.js";

function randomIntBetween(min, maxExclusive) {
  return Math.floor(Math.random() * (maxExclusive - min) + min);
}

function getAsteroidOrbitVelocity(asteroid) {
  return (
    Number(
      asteroid.close_approach_data?.[0]?.relative_velocity
        ?.kilometers_per_hour ?? 0
    ) / 10
  );
}

export function createPlanetObjects() {
  return PLANET_DEFINITIONS.map(
    (definition) =>
      new SpaceObject({
        ...definition,
      })
  );
}

export function createAsteroidObjects(asteroids = []) {
  return asteroids.map(
    (asteroid) =>
      new SpaceObject({
        id: asteroid.id,
        name: asteroid.name,
        diameter: ASTEROID_SCENE_DIAMETER,
        inclination: randomIntBetween(-90, 90),
        isAsteroid: true,
        orbitRadius: randomIntBetween(50, 160),
        orbitVelocity: getAsteroidOrbitVelocity(asteroid),
        textureSource: "moon.jpg",
      })
  );
}

export function addObjectsToScene(scene, objects) {
  objects.forEach((object) => {
    scene.add(object.sceneObject);

    if (object.orbit) {
      scene.add(object.orbit);
    }
  });
}

export function animateObjects(objects) {
  objects.forEach((object) => {
    object.animate();
  });
}
