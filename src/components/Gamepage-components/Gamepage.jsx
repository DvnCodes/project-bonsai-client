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
    isBanished: false
  };

  render() {
    const { isBanished } = this.state;

    return !this.props.currentState.loggedIn ? (
      <Redirect noThrow to="/" />
    ) : (

      <div>
        {this.state.showGameSummary && <Redirect noThrow to="/summary" />}{" "}
        <h1>GAMEPAGE</h1>
        {this.state.winner && <h2>{this.state.winner} wins!</h2>}

        <IonPhaser game={this.state.game} initialize={this.state.initialize} />
        {isBanished && <h1>BANISHED</h1>}
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state !== prevState) {
      this.state.socket.on("onDie", playerId => {
        if (playerId === this.state.socket.id) {
          this.setState({ isBanished: true });
        }
      });
    }
  }
}

export default Gamepage;
