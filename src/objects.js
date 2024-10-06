import * as THREE from 'three';

export const objectScale = 1275.6;
export const orbitationVelocityScale = 2160000;
export const radiusFromCenter = 5;

function getRandomColor() {
    const colors = [
        0xCCCCCC, // Cor cinza claro
        0x8B4513, // Cor marrom
        0x8B0000, // Cor vermelho escuro
        0x8B008B, // Cor roxo escuro
        0x8B3E2F, // Cor marrom avermelhado
        0x8B5A2B, // Cor marrom oliva
        0x8B7D6B, // Cor cinza escuro
        0x8B008B, // Cor roxo escuro (duplicada, pode ser removida)
    ];

    // Retorna uma cor aleatória da lista'
    return new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
}

function distortGeometry(geometry) {
    const position = geometry.attributes.position;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        const noise = Math.random() * 0.05; // Aumenta a intensidade do ruído
        vertex.addScaledVector(vertex.normalize(), noise);

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }
    geometry.computeVertexNormals();
}

export class NEObject {
    /**
     * Represents a Near Earth Object.
     * @constructor
     * @param {string} id - The id of the object.
     * @param {string} name - The name of the object.
     * @param {number} diameter - The object diameter in kilometers.
     * @param {string} descriptionText - The description showed in the info modal.
     * @param {number} rotationVelocity - The rotation velocity of the object.
     * @param {number} orbitationVelocity - The orbitation velocity of the object.
     * @param {string} textureSource - The path to the texture of this object.
     */
    constructor(id, name, diameter, descriptionText, rotationVelocity, orbitationVelocity, earthDistance, textureSource=undefined, isAsteroid=false) {
        this.id = id;
        this.name = name;
        this.diameter = diameter;
        this.descriptionText = descriptionText;
        this.rotationVelocity = rotationVelocity;
        this.orbitationVelocity = orbitationVelocity;
        this.textureSource = textureSource;
        this.earthDistance = earthDistance;
        this.isAsteroid = isAsteroid;

        this.angle = 0;

        this._sceneObject = new THREE.Mesh(this._sceneObjectGeometry, this._sceneObjectMaterial);
        this._sceneObject.name = name;
        
        if (isAsteroid) {
            this._sceneObject.castShadow = true;
            this._sceneObject.receiveShadow = true
        }
        

        this.setOrbit();
    }

    // Corrigido: getters agora retornam as instâncias de geometry e material corretamente
    get _sceneObjectGeometry() {
        if (this.isAsteroid) {
            const geometry = new THREE.DodecahedronGeometry(this.scaledRadius, 1);
            distortGeometry(geometry);
            return geometry;
        }

        return new THREE.SphereGeometry(this.scaledRadius, 32, 32);
    }

    get _sceneObjectMaterial() {
        if (this.isAsteroid) {
            return new THREE.MeshBasicMaterial({
                color: getRandomColor(),
                roughness: 0.8,
                metalness: 0.2
            });
        }

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.textureSource);
        return new THREE.MeshBasicMaterial({ map: texture });
    }

    get scaledRadius() { return (this.diameter / objectScale) / 2; }

    get sceneObject() { return this._sceneObject; } 

    setOrbit() {      
        const orbitCurve = new THREE.EllipseCurve(
            0, 0,  // Ponto central (x, y)
            this.earthDistance + 5, this.earthDistance + 5,  // Raio (xRadius, yRadius)
            0, 2 * Math.PI,  // Ângulo inicial e final
            true,  // Sentido horário ou anti-horário
            0  // Rotação
          );

        // Gera os pontos ao longo da curva
        const points = orbitCurve.getPoints(100);  // 100 pontos para suavizar

        // Converte os pontos em uma geometria de linha
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Cria o material da linha
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        orbitMaterial.isOrbit = true;

        // Cria a linha (órbita)
        this.orbit = new THREE.Line(orbitGeometry, orbitMaterial);

        // Posiciona a órbita no plano XY
        this.orbit.rotation.x = Math.PI / 2;
    }

    animate() {
        // Rotação
        this.sceneObject.rotation.y += this.orbitationVelocity/orbitationVelocityScale;

        // Atualiza o ângulo da Lua para criar a animação circular
        this.angle += 0.001; // Velocidade de rotação (ajustável)

        // Calcula as novas coordenadas do planeta
        const x = (radiusFromCenter + this.earthDistance) * Math.cos(this.angle);
        const z = (radiusFromCenter + this.earthDistance) * Math.sin(this.angle);
      
        // Atualiza a posição do planeta

        // Calcula a nova posição da Lua usando seno e cosseno
        this.sceneObject.position.set(x, 0, z);
    }
}