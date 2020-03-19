import React, { Component } from "react";
import { StyledButton } from "../Styles/ui.styles";
class QuestionCard extends Component {
  state = {
    correctAnswer: "",
    index: null,
    answered: false
  };

  render() {
    const { question, answers } = this.props;
    const { correctAnswer, index, answered } = this.state;
    console.log(answers, "hi");

    return (
      <header>
        {" "}
        <ol style={{ listStyleType: "none", margin: 0, padding: 0 }}>
          {answers.map((answer, i) => {
            return (
              <li
              // className={
              //   answered && answer === question.correctA
              //     ? "correct_answer"
              //     : answer !== question.correctA && index === i
              //     ? "incorrect_answer"
              //     : null
              // }
              >
                <StyledButton
                  onClick={e => {
                    this.correctAnswer(e, answer, i);
                  }}
                  answered={answered}
                  answer={answer}
                  correctAnswer={question.correctA}
                  index={index}
                  answerIndex={i}
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
      ? this.setState({ correctAnswer: "y", index: i, answered: true }, () =>
          setTimeout(() => {
            this.setState({ correctAnswer: "", index: null, answered: false });
          }, 700)
        )
      : this.setState({ correctAnswer: "n", index: i, answered: true }, () =>
          setTimeout(() => {
            this.setState({ correctAnswer: "", index: null, answered: false });
          }, 700)
        );

    handleAnswer(e, answer);
  };
}

export default QuestionCard;
