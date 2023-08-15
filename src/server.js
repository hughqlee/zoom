import http from "http";
import {WebSocketServer} from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket.on("message", (ev) => {
        const something = ev.toString('utf8');
        const { nameValue, msgValue } = JSON.parse(something);
        socket["name"] = nameValue;
        sockets.forEach((aSocket) => aSocket.send(`${nameValue}: ${msgValue}`));
    });
});

server.listen(3000);