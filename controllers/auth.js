const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');

const crearUsuario = async( req, res = response ) => {

    /*if ( name.length < 5 ) {
        return res.status(400).json({
            ok: false,                                          ------>       SE ELIMINA PORQUE SE OCUPA EL EXPRESS VALIDATOR
            msg:'El nombre debe de ser mayor a 5 letras'
        });
    }*/

    const { email, password } = req.body;

    try 
    {
        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        usuario = new Usuario( req.body );
        
        // ENCRIPTAR CONTRASEÑA
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // GENERAR JWT
        const token = await generarJWT( usuario.id, usuario.name );


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } 
    catch (error) 
    {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    
}

const loginUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try 
    {
        // SE REVISA SI EL USUARIO NO EXISTE
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe usuario con ese email'
            });
        }

        // CONFIRMAR LA CONTRASEÑA (COMPARA LA DEL LOGIN CON LA QUE ESTA EN LA BD)
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // GENERAR JWT
        const token = await generarJWT( usuario.id, usuario.name );


        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } 
    catch (error) 
    {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

    /*res.status(201).json({
        ok: true,
        msg: 'login',
        email,
        password
    })*/
}

const revalidarToken = async (req, res = response ) => {

    const { uid, name } = req;

    const token = await generarJWT( uid, name )

    res.json({
        ok: true,
        uid,
        name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}