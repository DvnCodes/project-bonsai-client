import React, { Component } from "react";
import { BarContainer } from "../Styles/container.styles";

class QuizResultPage extends Component {
  state = { health: 0 };
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
        <h2>Game Effects</h2>
        <p>Health</p>
        <BarContainer val={this.state.health} color={"red"}>
          <div></div>
        </BarContainer>
        {/* <p>SpellPower</p>
        <BarContainer val={this.state.health / 2 + "%"} color={"blue"}>
          <div></div>
        </BarContainer> */}
      </div>
    );
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ health: (this.props.score + 1) * 5 });
    }, 3000);
  }
}

export default QuizResultPage;
