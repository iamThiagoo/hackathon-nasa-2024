import * as THREE from 'three';

export const orbitationVelocityScale = 21600000;
export const radiusFromCenter = 5;
export const sunDiameter = 1392684;
export const sunSimulatedDiameter = 15;
export const sizeScale = (sunDiameter / sunSimulatedDiameter)
export const planetScale = sizeScale / 10;

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
     * @param {number} id - The id of the object.
     * @param {string} name - The name of the object.
     * @param {number} diameter - The object diameter in kilometers.
     * @param {number} rotationVelocity - The rotation velocity of the object.
     * @param {number} orbitationVelocity - The orbitation velocity of the object.
     * @param {string} textureSource - The path to the texture of this object.
     */
    constructor(id, name, diameter, rotationVelocity, orbitationVelocity, earthDistance, textureSource=undefined, inclination, isAsteroid=false) {
        this.id = id;
        this.name = name;
        this.diameter = diameter;
        this.rotationVelocity = rotationVelocity;
        this.orbitationVelocity = orbitationVelocity;
        this.textureSource = textureSource;
        this.earthDistance = earthDistance;
        this.isAsteroid = isAsteroid;

        this.angle = 0;

        this._sceneObject = new THREE.Mesh(this._sceneObjectGeometry, this._sceneObjectMaterial);
        this._sceneObject.name = name;
        this.inclination = inclination;

        this.actualInclination = inclination;
        this.isAscending = false;

        if (isAsteroid) {
            this._sceneObject.castShadow = true;
            this._sceneObject.receiveShadow = true
        }

        this._sceneObject.isAsteroid = isAsteroid;
        this._sceneObject.isAsteroid = this.isAsteroid;
        this._sceneObject.name = this.name;
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
                roughness: 0.8
            });
        }

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.textureSource);
        return new THREE.MeshBasicMaterial({ map: texture });
    }

    get scaledRadius() { return (this.diameter / 2) / planetScale; }

    get sceneObject() { return this._sceneObject; }

    setOrbit() {
        this.orbitCurve = new THREE.EllipseCurve(
            0, 0,  // Ponto central (x, y)
            this.earthDistance + 5, this.earthDistance + 5,  // Raio (xRadius, yRadius)
            0, 2 * Math.PI,  // Ângulo inicial e final
            true,  // Sentido horário ou anti-horário
            0  // Rotação
        );

        // Gera os pontos ao longo da curva
        const points = this.orbitCurve.getPoints(100);  // 100 pontos para suavizar

        // Converte os pontos em uma geometria de linha
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);

        // Cria o material da linha
        const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
        orbitMaterial.isOrbit = true;

        // Cria a linha (órbita)
        this.orbit = new THREE.Line(orbitGeometry, orbitMaterial);

        // NÃO aplique rotação no plano XY
        // this.orbit.rotation.x = Math.PI / 2; // <---- REMOVER ESSA LINHA
        this.orbit.rotation.y = THREE.MathUtils.degToRad(this.inclination);  // Mantém a inclinação
    }

    animate() {
        // Rotação do próprio objeto (auto-rotação)
        this.sceneObject.rotation.y += 0.01;

        // Atualiza o ângulo de rotação ao longo da órbita
        this.angle += this.orbitationVelocity / orbitationVelocityScale; // Escala de velocidade orbital

        // Normaliza o ângulo para ficar entre 0 e 1 (pois o getPoint utiliza valores entre 0 e 1)
        const normalizedAngle = (this.angle / (2 * Math.PI)) % 1;

        // Usa o `getPoint` da órbita (EllipseCurve) para obter a posição ao longo da curva
        const point = this.orbitCurve.getPoint(normalizedAngle);

        // Aplica a inclinação manualmente
        const inclinedY = point.y * Math.cos(THREE.MathUtils.degToRad(this.inclination));
        const inclinedZ = point.y * Math.sin(THREE.MathUtils.degToRad(this.inclination));

        // Atualiza a posição do objeto no espaço com inclinação aplicada
        this.sceneObject.position.set(point.x, inclinedY, inclinedZ);
    }
}