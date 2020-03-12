import React, { Component } from "react";

class GameSummary extends Component {
  state = { statsData: this.props.statsData };

  render() {
    return (
      <div>
        <h1>Game Summary</h1>

        {Object.keys(this.state.statsData).map(ID => {
          console.log(this.state.statsData[ID].winner);
          if (this.state.statsData[ID].winner === true) {
            return <h2>WINNER: {this.state.statsData[ID].username}</h2>;
          }
        })}

        <ul>
          {Object.keys(this.state.statsData).map(ID => {
            return (
              <li>
                {this.state.statsData[ID].username} : KILLS:{" "}
                {this.state.statsData[ID].kills} HITS:{" "}
                {this.state.statsData[ID].hits}
              </li>
            );
          })}
        </ul>
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
}

export default GameSummary;
