import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";
import Lobby from "./components/Lobby-components/Lobby";
import socketIOClient from "socket.io-client";
import Gamepage from "./components/Gamepage-components/Gamepage";

const socket = socketIOClient("localhost:8080");
// const socket = socketIOClient("masters-of-maths.herokuapp.com");

class App extends React.Component {
  state = {
    clientDetails: { loggedIn: false },
    audioPlay: false,
    selectedTrack: null
  };

  updateClientDetails = clientDetailsFromServer => {
    this.setState({ clientDetails: clientDetailsFromServer });
  };

  render() {
    return (
      <>
        <Header />
        {/* <audio src="./assets/battleMusic.wav" autoPlay="true" /> */}
        <Router className="main">
          <Login
            path="/"
            socket={socket}
            updateClientDetails={this.updateClientDetails}
            currentState={this.state.clientDetails}
          />
          <Lobby
            path="/lobby"
            socket={socket}
            updateClientDetails={this.updateClientDetails}
            currentState={this.state.clientDetails}
          />
          <QuizPage
            path="/quiz"
            socket={socket}
            updateClientDetails={this.updateClientDetails}
            currentState={this.state.clientDetails}
          />
          <Gamepage
            path="/game"
            socket={socket}
            updateClientDetails={this.updateClientDetails}
            currentState={this.state.clientDetails}
          />
        </Router>
      </>
    );
  }
}

export { App, socket };
