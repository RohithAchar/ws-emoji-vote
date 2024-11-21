import { useEffect, useState } from "react";

const App = () => {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [emojis, setEmojis] = useState<
    { id: string; emoji: string; votes: number }[]
  >([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      setEmojis(JSON.parse(event.data));
    };
  }, []);

  if (!socket) return <div>Loading...</div>;

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      {emojis.map((emoji) => (
        <div
          style={{
            cursor: "pointer",
          }}
          onClick={() => {
            socket.send(JSON.stringify(emoji.id));
          }}
          key={emoji.id}
        >
          <div style={{ fontSize: "4rem" }}>{emoji.emoji}</div>
          <p
            style={{
              fontSize: "3rem",
              textAlign: "center",
              marginTop: "0rem",
            }}
          >
            {emoji.votes}
          </p>
        </div>
      ))}
    </div>
  );
};

export default App;
