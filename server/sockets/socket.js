const { io } = require('../server');
const Usuarios = require('../classes/usuarios');

const {crearMensaje} = require('../utils/utils');



const usuarios = new Usuarios();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    client.on('entrarChat', (usuario, callback) => {
        if(!usuario.nombre || !usuario.sala) {
            return callback({
                err: true,
                mensaje: 'El nombre y sala son necesarios'
            });
        }

        client.join(usuario.sala);

        console.log(usuario);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);


        client.broadcast.to(usuario.sala).emit('listaPersona', usuarios.getPersonasPorSala(usuario.sala));

        return callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', data => {
        const persona = usuarios.getPersona(client.id);
        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });



    client.on('disconnect', () => {
        console.log('Usuario desconectado');
        const personaBorrada = usuarios.borrarPersona(client.id);
        console.log('Persona Borrada: ', personaBorrada);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    client.on('mensajePrivado', data => {
        const persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });


});