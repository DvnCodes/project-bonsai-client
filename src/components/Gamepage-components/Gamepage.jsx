import React, { Component } from "react";
import { IonPhaser } from "@ion-phaser/react";
import { config } from "../../scenes/gameScene";

class Gamepage extends Component {
  state = {
    initialize: true,
    game: config,
    endpoint: "localhost:8084",
    socket: null
  };
  render() {
    return (
      <div>
        <h1>GAMEPAGE</h1>
        <IonPhaser game={this.state.game} initialize={this.state.initialize} />
      </div>
    );
  }
}

export default Gamepage;
