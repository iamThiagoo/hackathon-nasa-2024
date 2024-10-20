import { PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function getDevicePixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 2);
}

export function createSceneContext({ container }) {
  const scene = new Scene();
  const renderer = new WebGLRenderer({ antialias: true });

  renderer.setPixelRatio(getDevicePixelRatio());
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  camera.position.set(
    30 * Math.cos(Math.PI / 6),
    30 * Math.sin(Math.PI / 6),
    500
  );

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 10;
  controls.maxDistance = 250;

  window.addEventListener("resize", () => {
    renderer.setPixelRatio(getDevicePixelRatio());
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  return { camera, controls, renderer, scene };
}
