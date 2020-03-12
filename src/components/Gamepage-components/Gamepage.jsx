import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { gameSceneConfig } from "../../scenes/gameScene";
import { Redirect } from "@reach/router";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: gameSceneConfig,
    endpoint: "https://projects-game-backend.herokuapp.com/",
    socket: this.props.socket,
    winner: null,
    showGameSummary: false
  };
  render() {
    return (
      <div>
        {this.state.showGameSummary && (
          <Redirect
            noThrow
            to="/summary"
            playerClientUpdateObject={this.state.playerClientUpdateObject}
          />
        )}{" "}
        <h1>GAMEPAGE</h1>
        {this.state.winner && <h2>{this.state.winner} wins!</h2>}
        <IonPhaser game={this.state.game} initialize={this.state.initialize} />
      </div>
    );
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
    this.props.socket.on("gameWinnerNotification", username => {
      this.setState({ winner: username });
    });
    this.props.socket.on("showGameSummary", playerClientUpdateObject => {
      this.props.updateStatsData(playerClientUpdateObject);
      this.setState({ showGameSummary: true });
    });
  }
}

export default Gamepage;
