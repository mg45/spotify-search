const mongoose = require('mongoose');
require('dotenv').config()

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('DB connection successful'));

//console.log(con.connections);
//console.log('DB connection successful');})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'You must enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true
    }
})

const User = mongoose.model('User', userSchema);

// instance of usermodel
const testUser = new User({
  first_name: 'Marius',
  last_name: 'Golabski'
})

testUser.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log(err);
})