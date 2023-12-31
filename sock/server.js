
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { parse } from "url";

const seed = Math.floor(Math.random() * 100000);
console.log(seed);

const app = express();
app.use(express.static('../client'));

const wss = new WebSocketServer({ noServer: true });

const server = http.createServer(app);
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
})

const players = new Map();

wss.on('connection', (ws, req) => {
  const name = parse(req.url ?? "", true).query.name;
  if (!name) return ws.close();

  players.set(name, { ws, hp: 100, pos: [0, 0] });

  ws.on('message', (bytes) => {
    const msg = bytes.toString().toLowerCase().split(" ");

    if (msg[0].startsWith("move")) {
      const pos = JSON.parse(msg[1]);
      players.get(name).pos = pos;
    } else if (msg[0].startsWith("shoot")) {

    }
  });

  ws.on('close', () => {
    players.delete(name);
  });

  ws.send(`seed ${seed}`);
})

setInterval(() => {
  const sendPlayers = [];
  players.forEach((val, key) => {
    sendPlayers.push([key, val.hp, val.pos]);
  });

  const toSend = "players " + JSON.stringify(sendPlayers);

  players.forEach(val => {
    val.ws.send(toSend);
  })
}, 10);

setInterval(() => {
  console.log(players.size);
}, 3000);

server.listen(3000);
