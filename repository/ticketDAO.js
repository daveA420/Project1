const {DynamoDBClient, QueryCommand} = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
    ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({region: "us-west-1"});

const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "ticket_table";



async function getAllPendingTickets(){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {"#status": "status"},
        ExpressionAttributeValues: {":status": "pending"}
    });
    try{
        const data = await documentClient.send(command);
        return data.Items;
    }catch(error){
        console.error(error);
    }
}

async function getTicketsByAuthor(userid){
 
   const command = new ScanCommand({
        TableName,
        FilterExpression: "#author = :author",
        ExpressionAttributeNames: {"#author": "author"},
        ExpressionAttributeValues: {":author": userid},
   })
    try{
        const data = await documentClient.send(command);
        return data.Items;
    }catch(error){
        console.error(error);
    }
}

async function getTicketById(id){
    const command = new GetCommand({
        TableName,
        Key: {id: id}
    })
    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(error){
        console.error(error);
    }
}

async function postTicket(ticket){
    const command = new PutCommand({
        TableName,
        Item: ticket
    });
    try{
        const data = await documentClient.send(command);
        return data;
    }catch(error){
        console.error(error);
    }
}

async function updateTicketStatus(ticket){
    const command = new UpdateCommand({
        TableName,
        Key: {id: ticket.id},
        UpdateExpression: "set #status = :status",
        ExpressionAttributeNames: {"#status": "status"},
        ExpressionAttributeValues:{
         ":status": ticket.status 
        },
        ReturnValues: "ALL_NEW",
    });

    try{
        const data = await documentClient.send(command);
        const finalData = await updateTicketResolver(ticket);
        return finalData.Attributes;
    }catch(err){
        console.error("unable to read error:",JSON.stringify(err, null, 1));
        return null;
    }
};

async function updateTicketResolver(ticket){
    const command = new UpdateCommand({
        TableName,
        Key: {id: ticket.id},
        UpdateExpression: "set #resolver = :resolver",
        ExpressionAttributeNames: {"#resolver": "resolver"},
        ExpressionAttributeValues:{
         ":resolver": ticket.resolver 
        },
        ReturnValues: "ALL_NEW",
    });

    try{
        const data = await documentClient.send(command);
        return data;
    }catch(err){
        console.error("unable to read error:",JSON.stringify(err, null, 1));
        return null;
    }
};

async function deleteTicketById(id){
    const command = new DeleteCommand({
        TableName,
        Key: {id: id}
    });
    try{
        const data = await documentClient.send(command);
        return data;
    }catch(err){
        console.error(err);
        return null;
    }
}


module.exports = {
    getAllPendingTickets,
    getTicketsByAuthor,
    postTicket, 
    getTicketById,
    updateTicketStatus,
    deleteTicketById
    
}