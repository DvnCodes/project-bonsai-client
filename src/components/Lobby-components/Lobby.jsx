import React, { Component } from "react";
import { Link } from "@reach/router";

class Lobby extends Component {
  state = {
    everyoneReady: false,
    chat: [],
    chatInput: ""
  };
  render() {
    return (
      <div>
        <h1>Quiz Lobby</h1>
        {this.state.everyoneReady === false && (
          <button onClick={this.readyUp}>READY</button>
        )}
        {this.state.everyoneReady === true && (
          <Link to="/quiz">
            <button>START QUIZ! HURRY TIMES TICKING</button>{" "}
          </Link>
        )}
        <ul>
          {this.state.chat.map(comment => {
            return (
              <li>
                {comment.user} {comment.message}
              </li>
            );
          })}
        </ul>
        <form onSubmit={this.sendMessage}>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.chatInput}
          ></input>
          <button>Send</button>
        </form>
      </div>
    );
  }
  componentDidMount() {
    this.props.socket.emit("joinedLobby", "hi");
    this.props.socket.on("currentLobbyGuests", userList => {
      console.log("userList", userList);
    });
    this.props.socket.on("chatUpdate", chatArray => {
      console.log("UPDATE", chatArray);
      this.setState({ chat: chatArray });
    });
    this.props.socket.on("startGame", lobbyData => {
      console.log("EVERYONES READY");
      this.setState({ everyoneReady: true });
    });
  }

  readyUp = () => {
    this.props.socket.emit("ready for the quiz", "ready");
  };
  handleChange = event => {
    const { value } = event.target;
    this.setState({ chatInput: value });
  };
  sendMessage = event => {
    event.preventDefault();

    this.props.socket.emit("newMessage", this.state.chatInput);
    this.setState({ chatInput: "" });
  };
}

export default Lobby;
