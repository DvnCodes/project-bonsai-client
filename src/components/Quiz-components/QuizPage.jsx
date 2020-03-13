import React, { Component } from "react";
import Timer from "./Timer";
import QuizResultPage from "./QuizResultPage";
import { Redirect } from "@reach/router";
import { socket } from "../../App";

class QuizPage extends Component {
  state = {
    questions: [
      // { q: "3 x 3", correctA: "9", incorrectAs: ["1", "2", "3"] },
      // { q: "2 + 6", correctA: "8", incorrectAs: ["4", "5", "6"] },
      // { q: "7 - 5", correctA: "2", incorrectAs: ["1", "4", "3"] },
      // { q: "9 x 9", correctA: "81", incorrectAs: ["72", "99", "18"] }
    ],
    answers: [],
    currentQuestion: 0,
    answer: null,
    score: 0,
    answeredAll: false,
    quizOver: false,
    quizFinishTime: null
  };

  componentDidMount() {
    console.log("mounting");
    this.props.socket.emit("sendQuizQuestions");

    this.props.socket.on("beginQuiz", (questionsList, finishTime) => {
      this.setState({ questions: questionsList, quizFinishTime: finishTime });
    });
  }
  render() {
    const {
      questions,
      currentQuestion,
      quizOver,
      quizFinishTime,
      answeredAll,
      score
    } = this.state;
    let answers;

    if (questions[currentQuestion]) {
      answers = [
        questions[currentQuestion].correctA,
        ...questions[currentQuestion].incorrectAs
      ];

      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = answers[i];
        answers[i] = answers[j];
        answers[j] = temp;
      }
    }

    console.log(quizFinishTime, Date.now(), "TIMES");
    return (
      <div>
        <h1>Quiz</h1>
        {quizOver && <Redirect noThrow to="/game" />}
        {questions.length > 0 && (
          <>
            {Date.now() === quizFinishTime && this.quizOver}
            {!quizOver ? (
              <Timer seconds={20} timeUp={this.quizOver} />
            ) : (
              <>
                <h2>Game Starting in:</h2>
                <Timer seconds={10} timeUp={this.startGame} />
              </>
            )}
            {answeredAll ? (
              <QuizResultPage score={score} />
            ) : (
              <>
                <p>Score: {score}</p>
                <h2>{questions[currentQuestion].q} = ?</h2>
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
          </>
        )}
      </div>
    );
  }
  handleAnswer = e => {
    const { questions, currentQuestion } = this.state;
    console.log(questions[currentQuestion].correctA);
    console.log(e.target.innerText);
    if (parseInt(e.target.innerText) === questions[currentQuestion].correctA) {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score + 1;
        console.log("newscore", newScore);
        console.log(nextQuestion);
        return { currentQuestion: nextQuestion, score: newScore };
      });
    }
    if (
      parseInt(e.target.innerText) !== questions[currentQuestion].correctA &&
      this.state.score > 1
    ) {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score - 1;

        return { currentQuestion: nextQuestion, score: newScore };
      });
    } else {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        return { currentQuestion: nextQuestion };
      });
    }
    if (currentQuestion + 1 === questions.length) {
      return this.answeredAll();
    }
  };
  answeredAll = () => {
    this.setState({ answeredAll: true });
  };
  quizOver = () => {
    this.setState({ quizOver: true, answeredAll: true });
    console.log("quiz over");
    this.props.socket.emit("clientGameReady", this.state.score);
  };
  startGame = () => {
    console.log("START GAME");
  };
}
export default QuizPage;
