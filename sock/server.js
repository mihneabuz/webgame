
import { WebSocketServer } from "ws";
import { parse } from "url";

const seed = Math.floor(Math.random() * 100000);
console.log(seed);

const wss = new WebSocketServer({ port: 3000 });

const players = new Map();
const bullets = []

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
