import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class QuizResultPage extends Component {
  render() {
    return (
      <div>
        <h2>Results</h2>
        <p>You scored: {this.props.score}</p>
      </div>
    );
  }

  componentDidMount() {
    const socket = socketIOClient("localhost:8080");
    socket.emit("player ready", this.props.score);
  }
}

export default QuizResultPage;
