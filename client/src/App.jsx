import React, { useMemo } from "react";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { Container, TextField, Typography, Button,Box, Stack } from "@mui/material";

const App = () => {
  // const socket = useMemo(()=> io("http://localhost:3000" ,{withCredentials:true,}),[]);
  const socket = useMemo(()=> io("https://tic-tac-3hah.onrender.com/" ,{withCredentials:true,}),[]);


  const [message, SetMessage] = useState("");
  const [room,SetRoom] = useState("");
  const [socketID,setSocketID] = useState("");
  const [messages,SetMessages] = useState([]);
  const [roomName,setRoomName] = useState("");
  // console.log(messages);
  const handlesubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message,room});
    SetMessage("");
  };
  const joinRoomHandler = (e)=>{
    e.preventDefault();
    socket.emit('join-room',roomName)
    setRoomName("");
  }
  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log("connected", socket.id);
    });

socket.on("recieve-message",(data)=>{
  // console.log(data);
  SetMessages((messages)=>[...messages,data]);
  // console.log(messages);
})

    socket.on("welcome", (s) => {
      console.log(s);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
   

      <Box sx={{height : 200}} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketID}
      </Typography>
      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>

      </form>

      <form onSubmit={handlesubmit}>
        <TextField
          value={message}
          onChange={(e) => {
            SetMessage(e.target.value);
          }}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={(e) => {
            SetRoom(e.target.value);
          }}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
      <Stack>
        {
          messages.map((m,i)=>(
            <Typography key={i} variant="h6" 
            component="div"
            gutterBottom>
            {m}

            </Typography>
          ))
        }
      </Stack>
    </Container>
  );
};

export default App;
