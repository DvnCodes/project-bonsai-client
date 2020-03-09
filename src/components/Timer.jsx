import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Timer extends Component {
  state = {
    currentCount: 30
  };
  render() {
    return (
      <div>
        <h2>{this.state.currentCount}</h2>
      </div>
    );
  }

  componentDidMount() {
    this.intervalId = setInterval(this.timer.bind(this), 1000);
  }
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  timer() {
    this.setState({
      currentCount: this.state.currentCount - 1
    });
    if (this.state.currentCount < 1) {
      clearInterval(this.intervalId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("cdu");
    if (prevState.currentCount === 1) {
      this.props.quizOver();
    }
  }
}

export default Timer;
