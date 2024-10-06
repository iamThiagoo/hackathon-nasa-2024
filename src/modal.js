import $ from "jquery";
import * as THREE from 'three';
import { mouse, camera, scene, resetCameraPosition } from '../main.js';
import { int } from "three/webgpu";

const fixed_data = {'Earth':{mass: 'Aproximadamente 5,97 × 10²⁴ kg.',
                             density:'5,52 g/cm³ (o planeta mais denso do Sistema Solar).',
                             gravity:'9,8 m/s² (ou 1 g).',
                             translation_period:'Aproximadamente 365,25 dias (tempo que leva para orbitar o Sol).',
                             name: 'Terra'},
                      'Moon':{mass: ' Aproximadamente 7,35 × 10²² kg (cerca de 1/81 da massa da Terra).',
                              density:'3,34 g/cm³ (cerca de 60% da densidade da Terra).',
                              gravity:'Aproximadamente 1,62 m/s² (cerca de 1/6 da gravidade da Terra).',
                              translation_period:' 27,3 dias terrestres (conhecido como mês sideral).',
                              name: 'Lua'}
                      }

$('#close-modal-button').on('click', closeModal); 

export function closeModal () {
    $('#modal').css({'display': 'none'});
}

export function openModal () {
    $('#modal').css({'display': 'block'});
}

// 3. Configurando o Raycaster e o mouse
const raycaster = new THREE.Raycaster();

// Função para lidar com o evento de clique
function onObjectClicked(event) {
  // 3.1 Atualiza a posição do mouse para os valores de coordenadas normalizadas
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 3.2 Defina o raio a partir da câmera e da posição atual do mouse
  raycaster.setFromCamera(mouse, camera);

  // 3.3 Calcula os objetos que intersectam o raio
  const intersects = raycaster.intersectObjects(scene.children);

  // 3.4 Verifica se houve interseção e reage
  if (intersects.length > 0 && !intersects[0].object.isStar && !intersects[0].object.material.isOrbit) {
    focusOnObject(intersects[0].object);

    const information = fixed_data[intersects[0].object.name]
    $('#massa')[0].innerText = information.mass;
    $('#densidade')[0].innerText = information.density;
    $('#gravidade')[0].innerText = information.gravity;
    $('#periodoTransalacao')[0].innerText = information.translation_period;
    $('#title')[0].innerText = information.name;
    openModal();
  }

  // close
  // resetCameraPosition();
}

export let target = null;

function focusOnObject(intersectedObject) {
  const targetPosition = new THREE.Vector3();
  intersectedObject.getWorldPosition(targetPosition);
  target = intersectedObject;

  // Foco na posição do objeto
  const distance = 15; // Distância da câmera até o objeto
  camera.position.copy(targetPosition);
  camera.position.z += distance; // Mover a câmera para trás
  camera.lookAt(targetPosition); // Fazer a câmera olhar para o objeto
}

// 4. Adicionando o event listener de clique do mouse
window.addEventListener('click', onObjectClicked, false);