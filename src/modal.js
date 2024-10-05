import $ from "jquery";

$('#close-modal-button').on('click', function (event) {
    $('#modal').css({'display': 'none'});
}); 

export function closeModal () {
    const modalElement = document.getElementById('modal');
    modalElement.style.display = 'none';
}