import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { gameSceneConfig } from "../../scenes/gameScene";
import { Redirect } from "@reach/router";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: gameSceneConfig,
    endpoint: "https://projects-game-backend.herokuapp.com/",
    socket: this.props.socket
  };
  render() {
    return !this.props.currentState.loggedIn ? (
      <Redirect noThrow to="/" />
    ) : (
      <div>
        <h1>GAMEPAGE</h1>
        <IonPhaser game={this.state.game} initialize={this.state.initialize} />
      </div>
    );
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
  }
}

export default Gamepage;
