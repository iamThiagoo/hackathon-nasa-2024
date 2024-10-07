import $ from "jquery";
import * as THREE from 'three';
import { mouse, camera, scene, resetCameraPosition } from '../main.js';
import { sendMessage } from "./api/openai.js";
const fixed_data = {
  'Sun': {
    mass: 'Aproximadamente 1,989 × 10³⁰ kg (99,86% da massa total do Sistema Solar).',
    density: '1,41 g/cm³.',
    gravity: '274 m/s².',
    translation_period: 'O Sistema Solar orbita o centro da Via Láctea em cerca de 225-250 milhões de anos.',
    moons: 'Nenhuma.',
    temperature: 'Aproximadamente 5.500 °C na superfície (fotosfera) e até 15 milhões de °C no núcleo.',
    atmosphere: 'A atmosfera do Sol é extremamente quente e turbulenta, composta por plasma em constante movimento.',
    type: 'Estrela anã amarela (tipo espectral G2V).',
    interesting_fact: 'A luz do Sol leva aproximadamente 8 minutos e 20 segundos para chegar à Terra. Apesar de parecer estático, o Sol está perdendo cerca de 4 milhões de toneladas de massa por segundo, através da fusão nuclear.',
    sources: ['https://solarsystem.nasa.gov/sun', 'https://www.space.com/sun'],
    name: '☀️ Sol'
  },
  'Mercury': {
    mass: 'Aproximadamente 3,30 × 10²³ kg.',
    density: '5,43 g/cm³.',
    gravity: '3,7 m/s².',
    translation_period: 'Aproximadamente 88 dias terrestres.',
    temperature: 'De -173 °C à noite a 427 °C durante o dia.',
    moons: 'Nenhuma.',
    atmosphere: 'Extremamente fina, composta principalmente de oxigênio, sódio e hidrogênio.',
    interesting_fact: 'Mercúrio tem uma órbita altamente elíptica e pode se aproximar do Sol a apenas 46 milhões de km. Curiosamente, um dia em Mercúrio dura quase o dobro de seu ano.',
    sources: ['https://solarsystem.nasa.gov/planets/mercury/overview/', 'https://www.space.com/36-mercury-the-suns-closest-planetary-neighbor.html'],
    name: '✨ Mercúrio'
  },
  'Venus': {
    mass: 'Aproximadamente 4,87 × 10²⁴ kg.',
    density: '5,24 g/cm³.',
    gravity: '8,87 m/s².',
    translation_period: 'Aproximadamente 225 dias terrestres.',
    temperature: 'Cerca de 465 °C (temperatura mais alta de todos os planetas).',
    moons: 'Nenhuma.',
    atmosphere: 'Densa, composta principalmente de dióxido de carbono com nuvens de ácido sulfúrico.',
    interesting_fact: 'Vênus tem uma rotação retrógrada, ou seja, gira no sentido oposto à maioria dos planetas, e sua atmosfera cria um efeito estufa extremo, tornando-o mais quente que Mercúrio, mesmo sendo o segundo planeta mais próximo do Sol.',
    sources: ['https://solarsystem.nasa.gov/planets/venus/overview/', 'https://www.space.com/44-venus-second-planet-from-the-sun.html'],
    name: '🌕 Vênus'
  },
  'Earth': {
    mass: 'Aproximadamente 5,97 × 10²⁴ kg.',
    density: '5,52 g/cm³ (o planeta mais denso do Sistema Solar).',
    gravity: '9,8 m/s² (ou 1 g).',
    translation_period: 'Aproximadamente 365,25 dias (tempo que leva para orbitar o Sol).',
    temperature: 'Aproximadamente 15 °C (média global).',
    moons: 'Uma, chamada Lua.',
    atmosphere: 'Composta principalmente de nitrogênio (78%) e oxigênio (21%).',
    interesting_fact: 'A Terra é o único planeta conhecido a abrigar vida. Ela tem um campo magnético que a protege da radiação solar e cósmica, e sua atmosfera tem uma camada de ozônio que filtra os raios ultravioleta prejudiciais.',
    sources: ['https://solarsystem.nasa.gov/planets/earth/overview/', 'https://www.space.com/54-earth-history-composition-and-atmosphere.html'],
    name: '🌍 Terra'
  },
  'Moon': {
    mass: 'Aproximadamente 7,35 × 10²² kg (cerca de 1/81 da massa da Terra).',
    density: '3,34 g/cm³ (cerca de 60% da densidade da Terra).',
    gravity: 'Aproximadamente 1,62 m/s² (cerca de 1/6 da gravidade da Terra).',
    translation_period: '27,3 dias terrestres (conhecido como mês sideral).',
    moons: 'Nenhuma.',
    temperature: 'De -173 °C à noite a 127 °C durante o dia.',
    interesting_fact: 'A Lua sempre mostra o mesmo lado para a Terra, um fenômeno conhecido como rotação síncrona. Os astronautas da Apollo 11 foram os primeiros humanos a pisar na Lua em 1969.',
    sources: ['https://solarsystem.nasa.gov/moons/earths-moon/overview/', 'https://www.space.com/18175-how-was-the-moon-formed.html'],
    name: '🌙 Lua'
  },
  'Mars': {
    mass: 'Aproximadamente 6,42 × 10²³ kg.',
    density: '3,93 g/cm³.',
    gravity: '3,71 m/s².',
    translation_period: 'Aproximadamente 687 dias terrestres.',
    temperature: 'Média de -60 °C.',
    moons: 'Dois, chamados Fobos e Deimos.',
    atmosphere: 'Fina, composta principalmente de dióxido de carbono (95%), com traços de nitrogênio e argônio.',
    interesting_fact: 'Marte é conhecido como o "planeta vermelho" por causa do óxido de ferro (ferrugem) em sua superfície. Ele tem a montanha mais alta do Sistema Solar, Olympus Mons, com 22 km de altura.',
    sources: ['https://solarsystem.nasa.gov/planets/mars/overview/', 'https://www.space.com/47-mars-the-red-planet-fourth-planet-from-the-sun.html'],
    name: '👽 Marte'
  },
  'Jupiter': {
    mass: 'Aproximadamente 1,90 × 10²⁷ kg.',
    density: '1,33 g/cm³.',
    gravity: '24,79 m/s².',
    translation_period: 'Aproximadamente 11,86 anos terrestres.',
    temperature: 'Cerca de -145 °C.',
    moons: 'Mais de 79, incluindo os maiores, Ganimedes, Io, Europa e Calisto.',
    atmosphere: 'Principalmente hidrogênio e hélio.',
    interesting_fact: 'Júpiter é o maior planeta do Sistema Solar e tem uma tempestade conhecida como a Grande Mancha Vermelha, que é maior que a Terra e existe há pelo menos 400 anos.',
    sources: ['https://solarsystem.nasa.gov/planets/jupiter/overview/', 'https://www.space.com/7-jupiter-largest-planet-in-the-solar-system.html'],
    name: '🌕 Júpiter'
  },
  'Saturn': {
    mass: 'Aproximadamente 5,68 × 10²⁶ kg.',
    density: '0,69 g/cm³ (menos denso que a água).',
    gravity: '10,44 m/s².',
    translation_period: 'Aproximadamente 29,5 anos terrestres.',
    temperature: 'Cerca de -178 °C.',
    moons: 'Mais de 82, incluindo Titã, a maior delas.',
    atmosphere: 'Principalmente hidrogênio e hélio.',
    interesting_fact: 'Saturno é conhecido por seus belos anéis, compostos principalmente de gelo e partículas rochosas. Seus anéis são visíveis da Terra com telescópios amadores.',
    sources: ['https://solarsystem.nasa.gov/planets/saturn/overview/', 'https://www.space.com/48-saturn-the-solar-systems-major-ring-bearer.html'],
    name: '🪐 Saturno'
  },
  'Uranus': {
    mass: 'Aproximadamente 8,68 × 10²⁵ kg.',
    density: '1,27 g/cm³.',
    gravity: '8,69 m/s².',
    translation_period: 'Aproximadamente 84 anos terrestres.',
    temperature: 'Cerca de -224 °C (o planeta mais frio).',
    moons: '27 conhecidos, incluindo Titânia e Oberon.',
    atmosphere: 'Principalmente hidrogênio, hélio e metano.',
    interesting_fact: 'Urano gira de lado, com seu eixo inclinado quase 98 graus. Isso significa que, durante parte de sua órbita, um dos hemisférios fica continuamente voltado para o Sol por 42 anos.',
    sources: ['https://solarsystem.nasa.gov/planets/uranus/overview/', 'https://www.space.com/18923-facts-about-uranus.html'],
    name: '🌕 Urano'
  },
  'Neptune': {
    mass: 'Aproximadamente 1,02 × 10²⁶ kg.',
    density: '1,64 g/cm³.',
    gravity: '11,15 m/s².',
    translation_period: 'Aproximadamente 165 anos terrestres.',
    temperature: 'Cerca de -214 °C.',
    moons: '14 conhecidos, incluindo Tritão.',
    atmosphere: 'Principalmente hidrogênio, hélio e metano.',
    interesting_fact: 'Netuno tem os ventos mais fortes do Sistema Solar, com velocidades que podem ultrapassar 2.000 km/h. Ele também foi o primeiro planeta a ser descoberto por meio de cálculos matemáticos, antes de ser observado.',
    sources: ['https://solarsystem.nasa.gov/planets/neptune/overview/', 'https://www.space.com/18930-neptune-facts-about-the-eighth-planet.html'],
    name: '💫 Netuno'
  }
};

let passedTutorial = false;
let isMakingRequests = false;

$('#close-modal-button').on('click', closeModal);

$('#hide-button').on('click', () => {
  closeModal();
  $('#close-modal-button').show();
  $(event.target).hide();
  passedTutorial = true;
});

export function closeModal () {
    $('#modal').css({'display': 'none'});
    target = null;
}

export function openModal () {
    $('#modal').css({'display': 'block'});
}

// 3. Configurando o Raycaster e o mouse
const raycaster = new THREE.Raycaster();

// Função para lidar com o evento de clique
async function onObjectClicked(event) {
  if (!passedTutorial) {
    $('#close-modal-button').show();
    $('#hide-button').hide();
    passedTutorial = true;
  }

  // 3.1 Atualiza a posição do mouse para os valores de coordenadas normalizadas
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 3.2 Defina o raio a partir da câmera e da posição atual do mouse
  raycaster.setFromCamera(mouse, camera);

  // 3.3 Calcula os objetos que intersectam o raio
  const intersects = raycaster.intersectObjects(scene.children);

  // 3.4 Verifica se houve interseção e reage
  if (intersects.length > 0 && !intersects[0].object.isStar && !intersects[0].object.material.isOrbit && !isMakingRequests) {
    
    let index = null;
    isMakingRequests = true;

    intersects.forEach((intersect, item) => {
      if (intersect.object.name) {
        index = item;
        // focusOnObject(intersect.object);
      }
    })

    if (index == null) return;


    if(intersects[0].object.isAsteroid){
      document.getElementById('loader').style.background='#06060696';
      document.getElementById('loader').style.display = 'flex';
      $('.div-informacoes').html('');
      const returnOpenAI = await sendMessage(`informações sobre o asteroide, massa densidade, gravidade, Período de translação, Luase, Atmosfera, Curiosidade ${intersects[0].object.name}. monte com base no html
        <h1 style="margin-bottom: 20px"></h1>
        <p style="margin: 10px 0;"><strong>Massa:</strong>  </p>
        <p style="margin: 15px 0;"><strong>Densidade:</strong></p>
        <p style="margin: 15px 0;"><strong>Gravidade:</strong> </p>
        <p style="margin: 15px 0;"><strong>Período de translação:</strong> </p>
        <p style="margin: 15px 0;"><strong>Temperatura:</strong> </p>
        <p style="margin: 15px 0;"><strong>Luase:</strong> </p>
        <p style="margin: 15px 0;"><strong>Atmosfera:</strong></p>
        <p style="margin: 15px 0;"><strong>Curiosidade:</strong></p>
        <p style="margin: 15px 0 5px 0;"><strong>Fontes:</strong></p> e me retorne apenas a extrutura com o html sem mais explicações`);
      let htmlArteroid = returnOpenAI.replace('```', '').replace('html', '').replace('```', '');

      $('.div-informacoes').html(htmlArteroid);
      document.getElementById('loader').style.display = 'none';
    }else{

      let astroName = intersects[index].object.name;
      let content = fixed_data[astroName];

      let html = `
        <h1 style="margin-bottom: 20px">${content.name}</h1>
        <p style="margin: 10px 0;"><strong>Massa:</strong> ${content.mass} </p>
        <p style="margin: 15px 0;"><strong>Densidade:</strong> ${content.density}</p>
        <p style="margin: 15px 0;"><strong>Gravidade:</strong> ${content.gravity}</p>
        <p style="margin: 15px 0;"><strong>Período de translação:</strong> ${content.density}</p>
        <p style="margin: 15px 0;"><strong>Temperatura:</strong> ${content.temperature}</p>
        <p style="margin: 15px 0;"><strong>Luase:</strong> ${content.luase}</p>
        <p style="margin: 15px 0;"><strong>Atmosfera:</strong> ${content.atmosphere}</p>
        <p style="margin: 15px 0;"><strong>Curiosidade:</strong>${content.interesting_fact}</p>
        <p style="margin: 15px 0 5px 0;"><strong>Fontes:</strong></p>
      `;

      html += "<ul style='padding: 0;'>";
      for (let i = 0; i < content.sources.length; i++) {
        html += `<li style="margin: 10px 0"><a href="${content.sources[i]}" target="_blank" style="margin: 10px 0; color: #35b3ff">${ content.sources[i]}</a></li>`;
      }
      html += "</ul>";

      $('.div-informacoes').html(html);
    }

    openModal();
    isMakingRequests = false;
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
  camera.lookAt(targetPosition - distance); // Fazer a câmera olhar para o objeto
}

// 4. Adicionando o event listener de clique do mouse
window.addEventListener('click', onObjectClicked, false);