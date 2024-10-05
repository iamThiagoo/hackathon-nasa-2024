// Velocidade padrão em X 
export const defaultRotationXVelocity = 0.001;

// Object com variáveis de velocidade de rotação da orbita
export let velocity = { x: defaultRotationXVelocity, y: 0 }; 

// Variáveis de dinâmica
let acceleration = 0.0005;
export let friction = 0.98;

// Variável de controle estado do mouse
let isDragging = false;

// Posição anterior do mouse
let previousMousePosition = { x: 0, y: 0 };

// Funções de controle do mouse
document.addEventListener('mousedown', function (event) {
    isDragging = true;
});

document.addEventListener('mousemove', function (event) {
    if (isDragging) {
        // Calcular a diferença de movimento do mouse
        let deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        };

        // Atualizar a velocidade de rotação com base na aceleração
        velocity.x = deltaMove.x * acceleration;
        velocity.y = deltaMove.y * acceleration;

        // Atualizar a posição anterior do mouse
        previousMousePosition = {
            x: event.offsetX,
            y: event.offsetY
        };
    }
});

document.addEventListener('mouseup', function (event) {
    isDragging = false;
});