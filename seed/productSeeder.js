var Product = require('../models/product');
const keys = require('../config/keys');
const mongoose = require('mongoose');

mongoose.connect(keys.mongodb.dbURI, () => {
    console.log('~|this time connected from the seeder|~')
})

var products = [
    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
        title: 'San Andreas', 
        description: 'Lone Wanderer',
        price: 40
    }),

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
        title: 'WWE', 
        description: 'Sexy',
        price: 84
    }),

    new Product({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
        title: 'GTA 6', 
        description: 'Female Protagonist',
        price: 30
    }),
  
];

var done = 0;
for(var i = 0; i < products.length; i++){
    products[i].save((err, result) => {
        done++;
        if(done === products.length){
            exit();
        }
    });
}

var exit = () => {
    mongoose.disconnect();
}

// it is not synchronous so i had to put it in the callback of the previous one

//mongoose.disconnect();