const { beforeEach, afterEach } = require("node:test");
const Service = require("../service/reg&loginService");
const uuid = require("uuid");

describe("Testing getting items from employee table", () => {
    //default employee table
    let employees;
    beforeAll(()=>{
        employees = [{id: "1",
            username: "david",
            password: "myPassword",
            role: "manager"}];


    });

    test("getting all items from list",async () => {
        let table = await Service.getAllEmployees();
        expect(table).toBeInstanceOf(Array);
    });

    test("get one employee by name", async() => {
        let employee = await Service.getEmployeeByName("david");
        expect(employee).toStrictEqual(employees[0]);
    });
    
    test("get employee by wrong name that doesn't exist", async() => {
        let employee = await Service.getEmployeeByName("does not exist");
        expect(employee).toBeFalsy();
    });
    test("get one employee by id", async() => {
        let employee = await Service.getEmployeeById("1");
        expect(employee).toStrictEqual(employees[0]);
    });
});

describe("testing registration and deletion", ()=>{
    let employees;
    let employee;
    beforeAll(()=> {
        employee = {
            id: uuid.v4(),
            username: "john Doe",
            password: "john's password",
            role: "employee"
        };
    })

    test("adding a new user will reflect in the users list",async ()=>{
        employees = await Service.getAllEmployees();

        let data = await Service.postEmployee(employee);
        let newtable = await Service.getAllEmployees();
       
        expect(employees.length).toBe(newtable.length - 1);
    });    
    afterAll(async () => {
        let data = await Service.deleteEmployeeByName("john Doe");
    })
});
