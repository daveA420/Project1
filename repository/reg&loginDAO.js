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

const TableName = "employee_table";



async function getAllEmployees(){
    const command = new ScanCommand({
        TableName
    });
    try{
        const data = await documentClient.send(command);
        let employees = data.Items;
        //sort employees by id
        employees.sort((a, b) => {
            return a.id >= b.id
        });

        return employees;
    }catch(error){
        console.error(error);
    }
}
async function getEmployeeById(id){
    const command = new GetCommand({
        TableName,
        Key: {id: id}
    });
    try{
        const data = await documentClient.send(command);
        return data.Item;
    }catch(error){
        console.error(error);
    }
}

async function getEmployeeByName(employeeName){
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#name = :name",
        ExpressionAttributeNames: {"#name": "username"},
        ExpressionAttributeValues: {':name': employeeName}
    });
    try{
        const data = await documentClient.send(command);
        return data.Items[0];
    }catch(error){
        console.error(error);
    }

}

async function postEmployee(Item){
    const command = new PutCommand({
        TableName,
        Item
    });
    try{
        const data = await documentClient.send(command);
        return data;
    }catch(error){
        console.error(error);
    }

}

async function deleteEmployeeByName(name){
    let item = await getEmployeeByName(name);
    if(item){
        const command = new DeleteCommand({
            TableName,
            Key: {id: item.id},
        });
    
        try{
            const data = await documentClient.send(command);
            return data;
        }catch(err){
            console.error("unable to read error:",JSON.stringify(err, null, 1));
        }
    }
    return null;
}

/*
async function deleteItem(name){
    let item = await getItemByName(name);
    if(item.product){
        const command = new DeleteCommand({
            TableName,
            Key: {example_partition_key: item.example_partition_key},
        });
    
        try{
            const data = await documentClient.send(command);
            return data;
        }catch(err){
            console.error("unable to read error:",JSON.stringify(err, null, 1));
        }
    }
    return null;
}

async function updateItem(item){
    let realItem = await getItemByName(item.product);
    const command = new UpdateCommand({
        TableName,
        Key: {example_partition_key: realItem.example_partition_key},
        UpdateExpression: "set price = :price",
        ExpressionAttributeValues:{
         ":price": item.price 
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
*/
module.exports = {
    getAllEmployees,
    getEmployeeById,
    getEmployeeByName,
    postEmployee, 
    deleteEmployeeByName
    //deleteItem,
    //updateItem
}