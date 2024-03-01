const employeeDAO = require('../repository/reg&loginDAO');

async function getAllEmployees(){
    const items = await employeeDAO.getAllEmployees();
    return items;
}
async function getEmployeeById(id){
    const employee = await employeeDAO.getEmployeeById(id);
    return employee;
}
async function getEmployeeByName(name){
    const item = await employeeDAO.getEmployeeByName(name);
    return item;
}

async function postEmployee(jsonData){
    if(validateItem(jsonData)){
        let data = await employeeDAO.postEmployee(jsonData);
        return data;
    }
    return null;
}


function validateItem(jsonData){
    if(!jsonData.username || !jsonData.password){
        return false;
    }
    return true;

}

async function deleteEmployeeByName(name){
    let data = await employeeDAO.deleteEmployeeByName(name);
    if(data){
        return data;
    }
    return null;
}
/*
async function updateItem(item){
    if(validateItem(item)){
        let data = await itemDAO.updateItem(item);
        return data;
    }
    return null;
}
*/
module.exports = {
    getEmployeeById,
    getAllEmployees,
    getEmployeeByName,
    postEmployee, 
    deleteEmployeeByName
  //  deleteItem,
  //  updateItem
}
