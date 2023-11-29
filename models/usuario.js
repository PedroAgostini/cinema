const { hashSync } = require('bcrypt')
const mongoose = require('./database')
const { Schema } = mongoose
const Usuarios = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    cpf:{ 
        type: String,
        required: true,
        unique: true
    },
    nome:{
        type: String,
        required: true
    },
    senha: String,
    chave: String
})

const Usuario = mongoose.model('Usuario', Usuarios)
module.exports = Usuario
