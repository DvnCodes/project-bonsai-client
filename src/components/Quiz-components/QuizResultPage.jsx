import React, { Component } from "react";
import { BarContainer, QuizResultsContainer } from "../Styles/container.styles";

class QuizResultPage extends Component {
  state = { health: 0 };
  render() {
    return (
      <QuizResultsContainer>
        <div id="results">
          <h2>Quiz Results</h2>
          <p>You scored: {this.props.score}</p>
          <ul>
            {this.props.quizResults.map((result, i) => {
              const question = result[0];
              const answer = result[1];
              return (
                <li key={i} id={answer}>
                  {question.q} {question.correctA}{" "}
                  {answer === "correct" ? "✓" : "✗"}
                </li>
              );
            })}
          </ul>
        </div>
        <div id="gameEffects">
          <h2>Game Effects</h2>
          <p>Health</p>
          <BarContainer val={this.state.health} color={"red"}>
            <div></div>
          </BarContainer>
          <p>SpellPower</p>
          <BarContainer val={this.state.health / 2} color={"blue"}>
            <div></div>
          </BarContainer>
        </div>
      </QuizResultsContainer>
    );
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ health: (this.props.score + 1) * 7 });
    }, 500);
  }
}

export default QuizResultPage;
