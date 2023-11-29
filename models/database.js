const mongoose = require("mongoose")

try {
    const uri = "mongodb+srv://pedrodeagostini:aula123@cluster0.dy7awen.mongodb.net/cinema"
    mongoose.connect(uri,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )    
}
catch (err) {
    console.log(err)
}

mongoose.Promise = global.Promise

module.exports = mongoose