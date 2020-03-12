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

class App extends React.Component {
  state = { clientDetails: { loggedIn: false } };

  updateClientDetails = clientDetailsFromServer => {
    this.setState({ clientDetails: clientDetailsFromServer });
  };

  render() {
    return (
      <div className="App">
        <Header />
        <Router>
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
      </div>
    );
  }
}

export { App, socket };
