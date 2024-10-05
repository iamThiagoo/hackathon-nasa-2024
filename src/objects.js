
class NEObject {
    name;
    id;
    diameter;
    descriptionText;
    rotationVelocity;
    orbitationVelocity;

    constructor(id, name, diameter, descriptionText, rotationVelocity, orbitationVelocity) {
        this.id = id;
        this.name = name;
        this.diameter = diameter;
        this.descriptionText = descriptionText;
        this.rotationVelocity = rotationVelocity;
        this.orbitationVelocity = orbitationVelocity;
    }
}