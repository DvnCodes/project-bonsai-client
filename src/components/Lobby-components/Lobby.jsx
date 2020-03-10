import React, { Component } from "react";
import Timer from "../Quiz-components/Timer";
import { redirectTo } from "@reach/router";

class Lobby extends Component {
  state = { playersReady: 0, startQuizTimer: false };

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

            {//check if quiz timer has been set to start by handleReady Func
            this.state.startQuizTimer && (
              <>
                <p>Quiz starting in: </p>
                <Timer seconds="5" timeUp={this.startQuiz} />
              </>
            )}
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
      this.setState({ startQuizTimer: true });
    }
    this.setState(currentState => {
      return { playersReady: currentState.playersReady + 1 };
    });
  };

  startQuiz = () => {
    console.log("start quix here");
    // trying to get the quiz page to render
    // redirectTo("/login");
  };
}

export default Lobby;
