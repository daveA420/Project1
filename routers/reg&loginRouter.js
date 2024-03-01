const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Service = require("../service/reg&loginService");
const uuid = require("uuid");
const saltRounds = 10;
const myKey = "my super secret key";

router.get('/', async (req, res)=>{
    const nameQuery = req.query.name;
    if(nameQuery){
        const item = await Service.getEmployeeByName(nameQuery);
        res.status(200)
        .json({message:`got item by name ${nameQuery}`, item});
    }
    else{
        const items = await Service.getAllEmployees();
        res.status(200).json({message: "got all items", items});
    }
});
/*router.get('/:id', async (req, res) =>{
    const id = req.params.id;
    const employee = await Service.getEmployeeById(id);
    if(employee){
        res.status(200).json(employee);
    }else{
        res.status(400).json({message: `could not find employee with id:${id}`});
    }
});
*/
router.post('/register', validateRegistration, async (req, res) =>{
    let pass = await bcrypt.hash(req.body.password, saltRounds);

    let employee = {
        id: uuid.v4(),
        username: req.body.username,
        password: pass,
        role: "associate"
    }
    const data = await Service.postEmployee(employee);
    if(data){
        res.status(201).send("Registration successful");
    }else{
        res
        .status(400)
        .send("Registration unsuccessful");
    }
});

router.post('/login', validateLogin, async (req, res) =>{
    let login = req.body;
    let user = await Service.getEmployeeByName(login.username);
    if (!(await bcrypt.compare(login.password, user.password))) {
        if(!(login.password === user.password)){
            res.status(400).send("Invalid Credentials");
        }else {
        // generate a JWT token
    
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          myKey,
          {
            expiresIn: "15m", // token expiration time (adjust as needed)
          });

        res.appendHeader("authorization", token);
        res.appendHeader("id", user.id);
        res.status(202).send(user.role);
      }
    }
});

/*router.get("/protected", authenticateToken, (req, res) => {
    res.json({ message: "Protected Route Accessed", user: req.username });
});

function authenticateToken(req, res, next) {
    //const authHeader = req.headers["authorization"];
    //console.log(authHeader);
    //const token = authHeader && authHeader.split(" ")[1];
    //console.log(token);
    const token = req.headers["authorization"];
    console.log(token);

    if (!token) {
      res.status(401).json({ message: "Unauthorized Access" });
      return;
    }
  
    jwt.verify(token, myKey, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Forbidden Access" });
        return;
      }
      req.user = user;
      next();
    });
}
*/
/*
router.delete('/', async (req, res)=>{
   const name = req.query.product;
   if(name){
        const data = await itemService.deleteItem(name);
        res.status(200).json({message: "deleted item", data});
   }
});
router.put('/', async (req, res) =>{
    const data = await itemService.updateItem(req.body);
    if(data){
        res.status(201).json({message: "updadted item", data});
    }else{
        res
        .status(400)
        .json({message: "failed to update", receivedData: req.body});
    }
});

*/
async function validateLogin(req,res, next){
    let name = req.body.username;
    let pass = req.body.password;
    let exists = await Service.getEmployeeByName(name);
    if(!name || !pass){
        res.status(400).json({message: "missing username or password"});
        return;
    }
    else if(exists){
        next();
    }else{
        res.status(400).json({message: "username does not exist"});
    }
}

async function validateRegistration(req, res, next){
    let employeeName = req.body.username;
    let pass = req.body.password;
    exists = await Service.getEmployeeByName(employeeName);

    if(!employeeName || !pass){
        res.status(400).send("missing information");
        return;
    }
    else if(exists) {
        res.status(400).send("username already in use");
        return;
    }else{
        next();
    }
}
module.exports = router;