const ticketDAO = require('../repository/ticketDAO');

async function getAllPendingTickets(){
    const items = await ticketDAO.getAllPendingTickets();
    return items;
}

async function getTicketsByAuthor(userid){
    const item = await ticketDAO.getTicketsByAuthor(userid);
    return item;
}
async function getTicketById(id){
    const ticket = await ticketDAO.getTicketById(id);
    return ticket;
}
async function postTicket(ticket){
    let data = await ticketDAO.postTicket(ticket);
    return data;
}

async function updateTicketStatus(ticket){
    let data = await ticketDAO.updateTicketStatus(ticket);
    return data;
}
async function deleteTicketById(id){
    let data = await ticketDAO.deleteTicketById(id);
    if(data){
        return data;
    }
    return null;
}
/*
function validateItem(jsonData){
    if(!jsonData.username || !jsonData.password){
        return false;
    }
    return true;

}
/*
async function deleteItem(name){
    let data = await itemDAO.deleteItem(name);
    if(data){
        return data;
    }
    return null;
}

async function updateItem(item){
    if(validateItem(item)){
        let data = await itemDAO.updateItem(item);
        return data;
    }
    return null;
}
*/
module.exports = {
    getAllPendingTickets,
    getTicketsByAuthor,
    postTicket, 
    getTicketById,
    updateTicketStatus,
    deleteTicketById
  //  deleteItem,
  //  updateItem
}
