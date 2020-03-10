import React, { Component } from "react";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("localhost:8084");

class Lobby extends Component {
  render() {
    return (
      <div>
        <h1>Quiz Lobby</h1>
      </div>
    );
  }

  componentDidMount() {
    socket.on("currentLobbyGuests", userList => {
      console.log(userList);
    });
  }
}

export default Lobby;
