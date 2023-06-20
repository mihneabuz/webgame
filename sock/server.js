
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
    console.log(msg);

    if (msg[0].startsWith("move")) {
      console.log("moving!");
      const pos = JSON.parse(msg[1]);
      players.get(name).pos = pos;
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
  console.log(toSend);

  players.forEach(val => {
    val.ws.send(toSend);
  })
}, 500);
