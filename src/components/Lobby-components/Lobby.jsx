import React, { Component } from "react";

class Lobby extends Component {
  state = { playersReady: 0 };

  //listens for new lobby additions
  componentDidMount() {
    this.props.socket.on("newLobbyAddition", newSocketID => {});
  }

  render() {
    return (
      <div>
        <h1>Lobby</h1>
        {!this.props.userList ? (
          <p>Loading players...</p>
        ) : (
          <>
            <p>Online Players:</p>
            <ul>
              {
                //maps over an array of logged in user socket IDs, adds their username to a list item
              }
              {Object.keys(this.props.userList).map(userSocketID => {
                return (
                  <li key={userSocketID}>
                    {this.props.userList[userSocketID].username}
                  </li>
                );
              })}
            </ul>
            <button onClick={this.handleReady}>Ready!</button>
          </>
        )}
      </div>
    );
  }

  handleReady = e => {
    //if the number of players ready to play, is the number of connected users, start quiz

    if (
      this.state.playersReady + 1 ===
      Object.keys(this.props.userList).length
    ) {
      console.log("start quiz");
    }
    this.setState(currentState => {
      return { playersReady: currentState.playersReady + 1 };
    });
  };
}

export default Lobby;
