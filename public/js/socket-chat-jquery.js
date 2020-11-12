const params = new URLSearchParams(window.location.search);

const divUsuarios = $('#divUsuarios');
const formEnviar = $('#formEnviar');
const txtMensaje = $('#txtMensaje');
const divChatbox = $('#divChatbox');

function renderizarUsuarios(personas) {

    let html = `<li>
                    <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
                </li>`;
    
    for(let i = 0; i < personas.length; i++) {
        html += `<li>
                    <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre} <small class="text-success">online</small></span></a>
                </li>`;
    }

    html += '<li class="p-20"></li>';

    divUsuarios.html(html);

}

function renderizarMensajes(mensaje, yo) {

    let html;
    const fecha = new Date(mensaje.fecha);
    const hora = `${fecha.getHours()}:${fecha.getMinutes()}`;

    let adminClass = 'info';

    if(mensaje.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if(yo) {
        html = `<li class="reverse animated fadeIn">
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                    <div class="chat-time">${hora}</div>
                </li>`
    } else {

        html = `<li class="animated fadeIn">
                    ${mensaje.nombre !== 'Administrador' ? '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>' : ''}
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-time">${hora}</div>
                </li>`;
    }

    divChatbox.append(html);

    scrollBottom();
    
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

divUsuarios.on('click', 'a', function () {

    const id = $(this).data('id');

    if(id) {
        console.log(id);
    }

});

formEnviar.on('submit', function (e) {
    e.preventDefault();

    if(txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        mensaje: txtMensaje.val()
    }, function(resp) {
        txtMensaje.val('').focus();
        renderizarMensajes(resp, true);
    });

});