import React, { Component } from "react";
import { StyledButton } from "../Styles/ui.styles";
class QuestionCard extends Component {
  state = {
    correctAnswer: "",
    index: null,
    answered: false,
    isButtonDisabled: false
  };

  render() {
    const { question, answers } = this.props;
    const { correctAnswer, index, answered } = this.state;
    // console.log(answers, "hi");

    return (
      <header>
        {" "}
        <ol style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          {answers.map((answer, i) => {
            const correctOrIncorrect =
              answered && answer === question.correctA
                ? "correct"
                : answer !== question.correctA && index === i
                ? "incorrect"
                : null;

            return (
              <li key={i}>
                <StyledButton
                  onClick={e => {
                    this.correctAnswer(e, answer, i);
                  }}
                  colour={correctOrIncorrect}
                  correctAnswer={question.correctA}
                  disabled={this.state.isButtonDisabled}
                >
                  {answer}
                </StyledButton>
              </li>
            );
          })}
        </ol>{" "}
      </header>
    );
  }
  correctAnswer = (e, answer, i) => {
    const { question, handleAnswer } = this.props;

    answer === question.correctA
      ? this.setState(
          {
            correctAnswer: "y",
            index: i,
            answered: true,
            isButtonDisabled: true
          },
          () =>
            setTimeout(() => {
              this.setState({
                correctAnswer: "",
                index: null,
                answered: false,
                isButtonDisabled: false
              });
            }, 1000)
        )
      : this.setState(
          {
            correctAnswer: "n",
            index: i,
            answered: true,
            isButtonDisabled: true
          },
          () =>
            setTimeout(() => {
              this.setState({
                correctAnswer: "",
                index: null,
                answered: false,
                isButtonDisabled: false
              });
            }, 1000)
        );

    handleAnswer(e, answer);
  };
}

export default QuestionCard;
