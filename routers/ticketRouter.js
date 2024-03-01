const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Service = require("../service/ticketService");
const uuid = require("uuid");
const employeeService = require("../service/reg&loginService");
const multr = require("multer");
const upload = multr();

router.get('/', async (req, res)=>{
    const statusQuery = req.query.status;
    const author = req.query.author;

    if(statusQuery == "pending"){
        const items = await Service.getAllPendingTickets(statusQuery);
        res.status(200)
        .json({message:`got item by status ${statusQuery}`, items});
    }
    else if(author && req.headers["current-user"] == author){
        const items = await Service.getTicketsByAuthor(author);
        res.status(200).json(items);
    }
    else{
        res.status(403).send("Cannot view tickets not belonging to the current user");
    }
});

router.get("/:id", async(req, res) =>{
    const id = String(req.params.id);
    const data = await Service.getTicketById(id);
    if(data){
        res.status(200).json(data);
    }else{
        res.status(400).json({message:`ticket with id: ${id} not found`});
    }
});

router.post('/', validateTicket, async (req, res) =>{

    let ticket = {
        id: uuid.v4(),
        author: String(req.body.author),
        description: req.body.description,
        type: req.body.type,
        status: "pending",
        resolver: "0",
        amount: req.body.amount
    }
    const data = await Service.postTicket(ticket);
    //console.log(data);
    if(data){
        res.status(201).json({id: `${ticket.id}`});
    }else{
        res
        .status(400)
        .json({message: "was not created", receivedData: req.body});
    }
});

router.put("/:id", validateProcessRequest, upload.none(), async (req, res) => {
    let ticket = req.ticket;
    //update the resolver and status
    ticket.resolver = req.user.id;
    ticket.status = req.body.status;

    const status = req.body.status;
    const data = await Service.updateTicketStatus(ticket);

    if(data){
        res.status(202).json(data);
    }
    else{
        res.status(500).json({message: "failed to update"});
    }
});

async function validateProcessRequest(req, res, next){
    const id = String(req.params.id);
    const userid = String(req.headers["current-user"]);
    
    const ticket = await Service.getTicketById(id);
    const user = await employeeService.getEmployeeById(userid);

    if(!ticket){
        res.status(400).json({message: `Ticket with id:${id} not found`});
    }
    /*else if(ticket.status !== "pending"){
        res.status(400).json({message: "ticket has already been processed"});
    }
    */
    else if(!user){
        res.status(400).json({message: `user with id:${userid} not found`});
    }
    else if(user.role !== "manager"){
        res.status(403).send("employee can not process a request");
    }
    else{
        req.ticket = ticket;
        req.user = user;
        next();
    }
}

async function validateTicket(req,res, next){
    let amount = req.body.amount;
    let description = req.body.description;
    if(!amount){
        res.status(400).send("Request can not be submitted without an amount");
        return;
    }
    else if(!description){
        res.status(400).json("Request can not be submitted without a description");
        return;
    }else{
        next();
    }
}
/*
async function validateRegistration(req, res, next){
    let employeeName = req.body.username;
    let pass = req.body.password;
    exists = await Service.getEmployeeByName(employeeName);

    if(!employeeName || !pass){
        res.status(400).json({message: "missing information"})
        return;
    }
    else if(exists) {
        res.status(400).json({message: "username already in use"});
        console.log(exists);
        return;
    }else{
        next();
    }
}
*/
module.exports = router;