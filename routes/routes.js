const express = require('express');
const router = express.Router();
const passport = require('passport');
const Product = require('../models/product');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const Cart = require('../models/cart');

router.get('/', (req, res, next) => {
    Product.find((err, docs) => {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0 ; i < docs.length; i+=chunkSize ){
            productChunks.push(docs.slice((i, i+chunkSize)));
        }
        res.render('index', { title: 'Shopping Cart', products: docs });
    });
});

router.get('/add-to-cart/:id', (req, res, next) => {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : { items: {} });

    Product.findById(productId, (err, product) => {
        if(err){
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart; // expression session will save it as each response will be sent back
        console.log(req.session.cart);
        res.redirect('/');
    });
});

// episode 13
router.get('/shopping-cart', (req, res, next) => {
    if(!req.session.cart){
        return res.render('shopping-cart', { title: 'your cart', products: null });
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', { title: 'your cart', products: cart.generateArray, totalPrice: cart.totalPrice })
});

module.exports = router;