import React, { Component } from "react";

class QuizResultPage extends Component {
  render() {
    return (
      <div>
        <h2>Results</h2>
        <p>You scored: {this.props.score}</p>
      </div>
    );
  }
}

export default QuizResultPage;
