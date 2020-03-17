import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";
import Lobby from "./components/Lobby-components/Lobby";
import socketIOClient from "socket.io-client";
import Gamepage from "./components/Gamepage-components/Gamepage";
import GameSummary from "./components/Gamepage-components/GameSummary";
const socket = socketIOClient("localhost:8080");
// const socket = socketIOClient("masters-of-maths.herokuapp.com");

class App extends React.Component {
  state = {
    clientDetails: { loggedIn: false },
    audioPlay: false,
    selectedTrack: null,
    statsData: undefined,
    audioMute: false
  };

  updateClientDetails = clientDetailsFromServer => {
    this.setState({ clientDetails: clientDetailsFromServer });
  };

  toggleAudioMute = () => {
    this.setState(currentState => {
      return {
        audioMute: !currentState.audioMute
      };
    });
  };

  render() {
    return (
      <>
        <Header
          toggleAudio={this.toggleAudioMute}
          audioMute={this.state.audioMute}
        />
        <audio
          src="./assets/battleMusic.wav"
          autoPlay={true}
          muted={this.state.audioMute}
        />
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
            updateStatsData={this.updateStatsData}
            currentState={this.state.clientDetails}
          />
          <GameSummary
            path="/summary"
            statsData={this.state.statsData}
            updateClientDetails={this.updateClientDetails}
            currentState={this.state.clientDetails}
            socket={socket}
          />
        </Router>
      </>
    );
  }

  updateStatsData = statsData => {
    this.setState({ statsData });
  };
}

export { App, socket };
