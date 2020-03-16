import React, { Component } from "react";
import { Link } from "@reach/router";

class GameSummary extends Component {
  state = { statsData: this.props.statsData };

  onClick = event => {
    this.props.socket.emit(
      "goLobbyFromGame",
      this.state.statsData[this.props.socket.id].rank
    );
  };

  render() {
    return (
      <div>
        <h1>Game Summary</h1>

        {Object.keys(this.state.statsData).map(ID => {
          return (
            this.state.statsData[ID].winner && (
              <h2 key={ID}>WINNER: {this.state.statsData[ID].username}</h2>
            )
          );
        })}

        <ul>
          {Object.keys(this.state.statsData)
            .sort((a, b) => (a.rank > b.rank ? 1 : -1))
            .map(ID => {
              return (
                <li key={ID}>
                  {this.state.statsData[ID].username} : RANK:{" "}
                  {this.state.statsData[ID].rank}
                  KILLS: {this.state.statsData[ID].kills}
                  HITS: {this.state.statsData[ID].hits}
                  ACCURACY:
                  {this.state.statsData[ID].spellsCast /
                    this.state.statsData[ID].hits}
                </li>
              );
            })}
        </ul>
        <Link to="/lobby">
          <button onClick={this.onClick}>return to lobby</button>
        </Link>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statsData === undefined &&
      this.props.statsData !== undefined
    ) {
      this.setState({ statsData: this.props.statsData });
      console.log("gamedata added to state");
    } else if (this.props.statsData !== prevProps.statsData) {
      this.setState({ statsData: this.props.statsData });
      console.log("gamedata added to state");
    }
  }

  componentDidMount() {
    this.props.socket.on("updateClientDetails", updatedDetails => {
      this.props.updateClientDetails(updatedDetails);
    });
  }

  componentWillUnmount() {
    this.props.socket.off("updateClientDetails");
  }
}

export default GameSummary;
