import React, { Component } from "react";
import Timer from "./Timer";
import QuizResultPage from "./QuizResultPage";
import { Redirect } from "@reach/router";

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
    quizFinishTime: null,
    toGame: false,
    quizResults: []
  };

  componentDidMount() {
    this.props.socket.emit("sendQuizQuestions");
    this.props.socket.on("beginQuiz", (questionsList, finishTime) => {
      this.setState({ questions: questionsList, quizFinishTime: finishTime });
    });
    this.props.socket.on("updateClientDetails", updatedDetails => {
      this.props.updateClientDetails(updatedDetails);
    });
  }

  componentWillUnmount() {
    this.props.socket.off("beginQuiz");
    this.props.socket.off("updateClientDetails");
  }
  render() {
    const {
      questions,
      currentQuestion,
      quizOver,
      quizFinishTime,
      answeredAll,
      score,
      toGame
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

    return (
      <div>
        <h1>Quiz</h1>
        {toGame && <Redirect noThrow to="/game" />}
        {/* {questions.length > 0 && ( */}

        {Date.now() === quizFinishTime && this.quizOver}
        {questions.length > 0 && (
          <>
            {" "}
            {!quizOver ? (
              <>
                <Timer seconds={30} timeUp={this.quizOver} />

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
            ) : (
              <>
                <h2>Game Starting in:</h2>

                <Timer seconds={10} timeUp={this.startGame} />
                <QuizResultPage
                  score={this.state.score}
                  quizResults={this.state.quizResults}
                />
              </>
            )}
          </>
        )}
      </div>
    );
  }

  handleAnswer = e => {
    const { questions, currentQuestion } = this.state;
    if (parseInt(e.target.innerText) === questions[currentQuestion].correctA) {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score + 1;

        const newResults = [...currentState.quizResults];
        newResults.push([this.state.questions[currentQuestion], "correct"]);

        return {
          currentQuestion: nextQuestion,
          score: newScore,
          quizResults: newResults
        };
      });
    }
    if (
      parseInt(e.target.innerText) !== questions[currentQuestion].correctA &&
      this.state.score > 1
    ) {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score - 1;
        const newResults = [...currentState.quizResults];
        newResults.push([this.state.questions[currentQuestion], "incorrect"]);

        return {
          currentQuestion: nextQuestion,
          score: newScore,
          quizResults: newResults
        };
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
    this.props.socket.emit(
      "clientGameReady",
      this.state.score,
      this.props.currentState.username
    );
  };
  startGame = () => {
    this.setState({ toGame: true });
  };
}
export default QuizPage;
