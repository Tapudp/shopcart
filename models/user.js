const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String }
});

userSchema.methods.encryptPassword = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = password => {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema);


// from the hash password and validate the password with compare
