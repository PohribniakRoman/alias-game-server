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
    comparePassword(userPassword){
        return new Promise((resolve,reject)=>{
                bcrypt.compare(this.password,userPassword).then((result)=>{
                    resolve(result);
                })
        })
    } 
}

module.exports = PasswordHandler;