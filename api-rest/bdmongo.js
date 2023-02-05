require('dotenv').config();
const {MongoClient} = require('mongodb');
const bcrypt = require("bcryptjs");

let uri = "mongodb://"+process.env.BD_USER+":"+process.env.BD_PASSWORD+"@my-mongo:27017/?authMechanism=DEFAULT";
const client = new MongoClient(uri);

function userValid(email, password) {
    let valid = true;
    if(email == "" || password == "") {
        valid = false;
    }
    return valid;
}

async function addUser(email, password){
    let result = false;
    try {
        client.connect();
        let numUser = await client.db('auth').collection('user').countDocuments({"email":email});
        if (numUser==0 && userValid(email, password)){
            let new_password = bcrypt.hashSync(password, 10);
            client.db('auth').collection('user').insertOne({"email":email, "password":new_password});
            result = true;
        }
    } catch (e) {}
    return result;
}

async function authUser(email, password){
    let result = false;
    try {
        client.connect();
        let numUser = await client.db('auth').collection('user').countDocuments({"email":email});
        if (numUser==1){
            let user = await client.db('auth').collection('user').find({"email":email}).toArray();
            let user_password = user[0].password;
            if (bcrypt.compareSync(password, user_password)){
                result = true;
            }
        }
    } catch (e) {}
    return result;
}

module.exports = { "addUser" : addUser, "authUser" : authUser}