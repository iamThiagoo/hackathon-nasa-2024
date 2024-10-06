import * as THREE from 'three';

export const objectScale = 1275.6;
export const orbitationVelocityScale = 2160000;
export const radiusFromCenter = 5;

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
    constructor(id, name, diameter, descriptionText, rotationVelocity, orbitationVelocity, textureSource, earthDistance) {
        this.id = id;
        this.name = name;
        this.diameter = diameter;
        this.descriptionText = descriptionText;
        this.rotationVelocity = rotationVelocity;
        this.orbitationVelocity = orbitationVelocity;
        this.textureSource = textureSource;
        this.earthDistance = earthDistance;

        this.angle = 0;
        this._sceneObject = new THREE.Mesh(this._sceneObjectGeometry, this._sceneObjectMaterial);
        this.setOrbit();
    }

    // Corrigido: getters agora retornam as instâncias de geometry e material corretamente
    get _sceneObjectGeometry() {
        return new THREE.SphereGeometry((this.diameter / objectScale) / 2, 32, 32);
    }

    get _sceneObjectMaterial() {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(this.textureSource);
        return new THREE.MeshBasicMaterial({ wireframe: false, map: texture, transparent: true });
    }

    get radius() { return (this.diameter / objectScale) / 2; }

    get sceneObject() { return this._sceneObject; } 

    setOrbit() {
        console.log(this.radius);
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
