const mongoose = require('mongoose');

const joueurSchema= mongoose.Schema({
   pseudo: { type: String, required: true },
   score: { type: Number, required: true },
   stutus : {type: Boolean, required:false}

  
},{
    collection :'players'
});

module.exports = mongoose.model('Joueur', joueurSchema);