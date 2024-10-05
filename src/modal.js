import $ from "jquery";
import * as THREE from 'three';
import { mouse, camera, scene } from '../main.js';

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
  if (intersects.length > 0) {
    openModal();
  }
}

// 4. Adicionando o event listener de clique do mouse
window.addEventListener('click', onObjectClicked, false);