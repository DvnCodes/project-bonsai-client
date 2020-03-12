import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { gameSceneConfig } from "../../scenes/gameScene";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: gameSceneConfig,
    endpoint: "https://projects-game-backend.herokuapp.com/",
    socket: this.props.socket,
    isBanished: false
  };
  render() {
    const { isBanished } = this.state;
    return (
      <div>
        <h1>GAMEPAGE</h1>
        <IonPhaser game={this.state.game} initialize={this.state.initialize} />
        {isBanished && <h1>BANISHED</h1>}
      </div>
    );
  }

  componentDidMount() {
    this.setState({ socket: this.props.socket });
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
