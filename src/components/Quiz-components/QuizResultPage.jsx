import React, { Component } from "react";

class QuizResultPage extends Component {
  render() {
    return (
      <div>
        <h2>Results</h2>
        <p>You scored: {this.props.score}</p>
        <ul>
          {this.props.quizResults.map(result => {
            const question = result[0];
            const answer = result[1];
            return (
              <li>
                {question.q} {question.correctA} {answer}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    // const socket = socketIOClient("localhost:8080");
    // socket.emit("set health", this.props.score);
  }
}

export default QuizResultPage;
