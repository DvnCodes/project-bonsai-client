import React, { Component } from "react";
import Timer from "./Timer";
import QuizResultPage from "./QuizResultPage";

class QuizPage extends Component {
  state = {
    questions: [
      { q: "3 x 3", correctA: "9", incorrectAs: ["1", "2", "3"] },
      { q: "2 + 6", correctA: "8", incorrectAs: ["4", "5", "6"] },
      { q: "7 - 5", correctA: "2", incorrectAs: ["1", "4", "3"] },
      { q: "9 x 9", correctA: "81", incorrectAs: ["72", "99", "18"] }
    ],
    currentQuestion: 0,
    answer: null,
    score: 0,
    quizOver: false
  };

  render() {
    const { questions, currentQuestion } = this.state;
    let answers;
    if (questions[currentQuestion]) {
      answers = [
        questions[currentQuestion].correctA,
        ...questions[currentQuestion].incorrectAs
      ];
    }
    return (
      <div>
        <h1>Quiz Page</h1>
        <Timer quizOver={this.quizOver} />
        {this.state.quizOver ? (
          <QuizResultPage score={this.state.score} />
        ) : (
          <>
            <h2>{questions[currentQuestion].q}</h2>
            <p>Score: {this.state.score}</p>
            <ul>
              {answers.map((answer, i) => {
                return (
                  <li key={i}>
                    <button onClick={this.handleAnswer}>{answer}</button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    );
  }

  handleAnswer = e => {
    const { questions, currentQuestion } = this.state;
    if (currentQuestion + 1 === questions.length) {
      return this.quizOver();
    }

    if (e.target.innerText === questions[currentQuestion].correctA) {
      console.log("correct answer");
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score + 1;
        return { currentQuestion: nextQuestion, score: newScore };
      });
    } else {
      console.log("incorrect answer");
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        return { currentQuestion: nextQuestion };
      });
    }
  };

  quizOver = () => {
    console.log("quiz over");
    this.setState({ quizOver: true });
  };
}

export default QuizPage;
