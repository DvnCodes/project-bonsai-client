import React, { Component } from "react";
import { Link, Redirect } from "@reach/router";

class Lobby extends Component {
  state = {
    everyoneReady: false,
    chat: [],
    chatInput: "",
    currentLobbyGuests: []
  };
  render() {
    return (
      <div>
        {this.state.everyoneReady === true && <Redirect noThrow to="/quiz" />}
        <h1>Quiz Lobby</h1>
        {console.log("lobbyGUESTS", this.state.currentLobbyGuests)}
        {this.state.everyoneReady === false && (
          <button onClick={this.readyUp}>READY</button>
        )}
        {this.state.everyoneReady === true && (
          <Link to="/quiz">
            <button>START QUIZ! HURRY TIMES TICKING</button>{" "}
          </Link>
        )}
        <div>
          <h2>Online Players:</h2>
          <ul>
            {this.state.currentLobbyGuests.map(guest => {
              return (
                <li>
                  {guest.username} {guest.ready}
                </li>
              );
            })}
          </ul>
        </div>
        <ul>
          <h2> CHAT</h2>
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
    this.props.socket.on("currentLobbyData", lobbyData => {
      console.log("userlist", lobbyData);
      this.setState({
        currentLobbyGuests: lobbyData.users,
        chat: lobbyData.messages
      });
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
