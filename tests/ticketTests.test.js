const { beforeEach, afterEach } = require("node:test");
const Service = require("../service/ticketService");
const uuid = require("uuid");

describe("testing retrieving tickets", ()=>{

    test("getAllPending tickets returns array", async() =>{
        let list = await Service.getAllPendingTickets();
        expect(list).toBeInstanceOf(Array);
    });
    test("getAllTicketsByAuthor with first author returns array", async() =>{
        let list = await Service.getTicketsByAuthor("1");
        expect(list).toBeInstanceOf(Array);
    });
    test("getTicketByID with id of 1 returns an object with matching id attribute", async() =>{
        let ticket = await Service.getTicketById("1");
        expect(ticket.id).toBe("1");
    })
});

describe("testing posting, updating, and deleting ticket", ()=>{
    let ticket;
    let id = "12345";

    beforeAll(() =>{
        ticket = {
            id: id,
            author: "1",
            description: "going places",
            type: "travel",
            status: "pending",
            resolver: "0",
            amount: 20.0
        }
    })
    test("posting ticket returns truthy", async() =>{
        let data = await Service.postTicket(ticket);
        expect(data).toBeTruthy();
    });
    test("updating ticket returns ticket", async() =>{
        changedTicket = ticket;
        changedTicket.status = "approved";
        changedTicket.resolver = "1";
        let returnedTicket = await Service.updateTicketStatus(changedTicket);
        expect(changedTicket).toStrictEqual(returnedTicket);
    });

    test("deleting ticket returns truthy", async() =>{
        let data = await Service.deleteTicketById(ticket.id);
        expect(data).toBeTruthy();
    });
});

