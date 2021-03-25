const bcrypt = require('bcrypt');
const saltRounds = 10;

class PasswordHandler{
    constructor(password){
        this.password = password;
    }
    hashPassword(){
        return new Promise((resolve,reject)=>{
                bcrypt.hash(this.password,saltRounds).then((hash)=>{
                    resolve(hash);
                })
        })
    } 
}

module.exports = PasswordHandler;