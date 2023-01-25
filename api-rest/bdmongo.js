const {MongoClient} = require('mongodb');
const bcrypt = require("bcryptjs");

let uri = "mongodb://root:root@localhost:1888/?authMechanism=DEFAULT";
const client = new MongoClient(uri);

async function addUser(email, password){
    let result = false;
    try {
        client.connect();
        let numUser = await client.db('auth').collection('user').countDocuments({"email":email});
        if (numUser==0){
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