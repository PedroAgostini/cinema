const express = require("express")
const route = express.Router()
const jwt = require("jsonwebtoken")
const Email = require("../components/email")
const bcrypt = require('bcrypt')

require('dotenv/config')

const Usuario = require('../models/usuario')

route.post("/login", async (req, res) => {
    const { email, senha } = req.body
    
    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"})

    if (!senha)
        return res.send({ msg: "Campo senha é obrigatório"})

    var usuario = await Usuario.findOne({ email })

    if (!usuario)
        return res.send({ msg: "Usuário ou senha inválido"})

    var valida_senha = await bcrypt.compare(senha, usuario.senha)
    // true ou false

    if (!valida_senha)
        return res.send({ msg: "Usuário ou senha inválido"})

    //1
    var dados = {
        id: usuario.id,
        email: usuario.email
    }

    //2
    var chave = process.env.TOKEN_KEY

    //3
    var tempo = { expiresIn: 60 * 1000 } //1 minuto
    
    var token = await jwt.sign(dados, chave, tempo)

    return res.send({ token })
})

route.post("/register", async (req, res) => {
    const { email, cpf, nome, senha } = req.body

    if (!email)
        return res.send({ msg: "Campo e-mail é obrigatório"})

    if (!cpf)
        return res.send({ msg: "Campo CPF é obrigatório"})

    if (!nome)
        return res.send({ msg: " Campo nome é obrigatório"})

        const existingUser = await Usuario.findOne({ $or: [{ email }, { cpf }] })

        if (existingUser) {
            if (existingUser.email === email) {
                return res.send({ msg: "E-mail já cadastrado" })
            } else if (existingUser.cpf === cpf) {
                return res.send({ msg: "CPF já cadastrado" })
            }
        }

    var numero = [
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9),
        parseInt(Math.random() * 9)
    ]
    numero = numero.join('')

    // Chama o método para registrar o usuário por e-mail (se necessário)
    Email.RegistrarUsuario(email, numero)
    
    // Criação do usuário com e-mail, chave e CPF
    var usuario = await Usuario.create({ email, chave: numero, cpf, nome })
    return res.send(usuario)
})

route.post("/alterarsenha", async (req, res) => {
    const { email, senha, confirma, chave } = req.body

    if (email == undefined) {
        return res.send({ msg: "Email nãoi pode ser nulo"})
    }
    //Outras condicoes
    
    
    if ( senha != confirma ) {
        return res.send({ msg: "Senha e confirma senha não são iguais"})
    }

    var dados = await Usuario.find({ email })


    if (chave != dados[0].chave) {
        return res.send({ msg: "A chave informa não é valida."})
    }

    var hash = await bcrypt.hash(senha, 10)

    dados[0].chave = null
    dados[0].senha = hash

    try {
        await dados[0].save()
        return res.send({ msg: "Senha alterada com sucesso."})
    } catch (err) {
        console.log(err)
        return res.send({ msg: "Ops! Ocorreu algum erro"})

    }

})

module.exports = app => app.use("/api", route)
