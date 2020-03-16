import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { gameSceneConfig } from "../../scenes/gameScene";
import { Redirect } from "@reach/router";
import { MegaNotificationContainer } from "../Styles/container.styles";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: { ...gameSceneConfig },
    endpoint: "https://projects-game-backend.herokuapp.com/",
    socket: this.props.socket,
    winner: null,
    showGameSummary: false,
    isBanished: false,
    inGame: false
  };

  render() {
    const { isBanished } = this.state;

    return !this.props.currentState.loggedIn ? (
      <Redirect noThrow to="/" />
    ) : (
      <>
        {this.state.showGameSummary && <Redirect noThrow to="/summary" />}{" "}
        <h1>GAMEPAGE</h1>
        {this.state.winner && (
          <MegaNotificationContainer>
            <h2>{this.state.winner} wins!</h2>
          </MegaNotificationContainer>
        )}
        <div id="gameWindow">
          {this.state.inGame ? (
            <IonPhaser game={this.state.game} />
          ) : (
            <h3>game not ready...</h3>
          )}
          {isBanished && <h1>BANISHED</h1>}
        </div>
      </>
    );
  }

  componentDidMount() {
    this.setState(() => {
      return {
        socket: this.props.socket,
        inGame: this.props.currentState.inGame
      };
    });
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

  componentWillUnmount() {
    this.props.socket.off("onDie");
    this.props.socket.off("gameWinnerNotification");
    this.props.socket.off("showGameSummary");
    this.props.socket.off("playerJoinedLobbyNotification");
    this.props.socket.off("newPlayer");
    this.props.socket.off("currentPlayers");
    this.props.socket.off("newAttack");
    this.props.socket.off("disconnect");
    this.props.socket.off("attackEnded");
    this.props.socket.off("spellAdded");
    this.props.socket.off("playerUpdates");
    this.props.socket.off("spellUpdates");
    this.props.socket.off("attackUpdates");
    this.props.socket.off("onDie");
  }
}

export default Gamepage;
