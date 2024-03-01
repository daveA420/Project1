const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const reg_and_login_router = require("./routers/reg&loginRouter");
const ticketRouter = require("./routers/ticketRouter");
const logger = require("./util/logger");

const PORT = 3000;

//app.use(express.urlencoded({extended:true}))
//app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Incoming ${req.method} : ${req.url}`);
  next();
});



app.use("/employees", reg_and_login_router);
app.use("/tickets", ticketRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});