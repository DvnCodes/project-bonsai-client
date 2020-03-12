import React, { Component } from "react";

class GameSummary extends Component {
  state = { statsData: null };
  componentDidMount() {}

  render() {
    return (
      <div>
        <h1>Game Summary</h1>
        {this.state.statsData && <h2>test</h2>}{" "}
        {/* <p>{this.props.statsData[0].life}</p> */}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.statsData === undefined && this.props.statsData) {
      this.setState({ statsData: this.props.statsData });
    }
  }
}

export default GameSummary;
