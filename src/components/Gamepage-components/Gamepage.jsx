import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { gameSceneConfig } from "../../scenes/gameScene";
import { Redirect } from "@reach/router";
import {
  MegaNotificationContainer,
  GameBorderUI
} from "../Styles/container.styles";
import PlayerStatsPane from "./PlayerStatsPane";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: { ...gameSceneConfig },
    endpoint: "https://projects-game-backend.herokuapp.com/",
    socket: this.props.socket,
    winner: null,
    showGameSummary: false,
    isBanished: false,
    inGame: false,
    playerHealthPercentage: 100
  };

  render() {
    const { isBanished } = this.state;

    return !this.props.currentState.loggedIn ? (
      <Redirect noThrow to="/" />
    ) : (
      <>
        {this.state.showGameSummary && <Redirect noThrow to="/summary" />}{" "}
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
        <GameBorderUI>
          <div className="borderRight"></div>
          <div className="borderLeft"></div>
          {/* <div className="borderTop"></div> */}
          <div className="borderTopLeft"></div>
          <div className="borderTopRight"></div>
          {/* <div className="borderBottom"></div> */}
          <div className="borderBottomLeft"></div>
          <div className="borderBottomRight"></div>
        </GameBorderUI>
        <PlayerStatsPane healthPercentage={this.state.playerHealthPercentage} />
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
    this.props.socket.on(
      "playerHealth",
      (clientID, currentHealth, maxHealth) => {
        console.log(clientID, currentHealth, maxHealth);
        if (this.props.socket.id === clientID) {
          const healthPercentage = (currentHealth / maxHealth) * 100;
          console.log(healthPercentage);
          this.setState({ playerHealthPercentage: healthPercentage });
        }
      }
    );
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
    this.props.socket.off("hit");
    this.props.socket.off("playerInput");
    this.props.socket.off("gameLoaded");
    this.props.socket.off("attackInput");
    this.props.socket.off("spell");
  }
}

export default Gamepage;
