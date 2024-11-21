import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let emojies = [
  { id: 1, emoji: "🤡", votes: 0 },
  { id: 2, emoji: "😂", votes: 0 },
  { id: 3, emoji: "😎", votes: 0 },
  { id: 4, emoji: "🗿", votes: 0 },
];

let votedUsers: Set<string> = new Set();

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (data, isBinary) => {
    let receivedData = isBinary ? data.toString() : data;
    const receivedId = Number(receivedData);

    emojies.map((emoji) => {
      if (emoji.id === receivedId) {
        emoji.votes += 1;
      }
      return emoji;
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(emojies), { binary: isBinary });
      }
    });
  });

  ws.send(JSON.stringify(emojies));
});
