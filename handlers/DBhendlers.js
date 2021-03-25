const Candidate = require("../schema/auth");
const Session = require("../schema/session");

class DBhendlers{
    constructor(password,login){
        this.password = password;
        this.login = login;
    }
    findUser(){
       return new Promise((resolve,reject)=>{
            Candidate.findOne({"login":this.login},(err,result)=>{
                resolve(result)
            })
        })
    } 
    findToken(token){
       return new Promise((resolve,reject)=>{
            Session.findOne({"token":token},(err,result)=>{
                resolve(result)
            })
        })
    } 
}

module.exports = DBhendlers;