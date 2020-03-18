import React, { Component } from "react";
import Timer from "./Timer";
import QuizResultPage from "./QuizResultPage";
import QuestionCard from "./QuestionCards";
import { Redirect } from "@reach/router";
import "../../App.css";

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
    score: 0,
    answeredAll: false,

    quizOver: false,
    quizFinishTime: null,
    toGame: false,
    quizResults: []
  };

  componentDidMount() {
    this.props.socket.emit("sendQuizQuestions");
    this.props.socket.on("beginQuiz", (questionsAndAnswers, finishTime) => {
      const [allQuestions, allAnswers] = questionsAndAnswers;
      console.log(allAnswers, allQuestions);

      this.setState({
        questions: allQuestions,
        answers: allAnswers,
        quizFinishTime: finishTime
      });
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
      answers,
      currentQuestion,
      quizOver,
      quizFinishTime,
      answeredAll,
      score,
      toGame,
      correct,
      correctAnswer,
      index
    } = this.state;

    return (
      <div>
        <h1>Quiz</h1>
        {toGame && <Redirect noThrow to="/game" />}

        {Date.now() === quizFinishTime && this.quizOver}
        {questions.length > 0 && (
          <>
            {" "}
            {!quizOver ? (
              <>
                <Timer seconds={1} timeUp={this.quizOver} />

                <p>Score: {score}</p>
                <h2>{questions[currentQuestion].q}?</h2>
                <QuestionCard
                  answers={answers[currentQuestion]}
                  question={questions[currentQuestion]}
                  handleAnswer={this.handleAnswer}
                />
              </>
            ) : (
              <>
                <h2>Game Starting in:</h2>

                <Timer seconds={1} timeUp={this.startGame} />
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

  handleAnswer = (e, answer) => {
    console.log("handler");
    const { questions, currentQuestion } = this.state;
    if (parseInt(answer) === questions[currentQuestion].correctA) {
      // this.setState({ correct: true }, () =>
      setTimeout(() => {
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
      }, 700);
      // );
    }
    if (parseInt(answer) !== questions[currentQuestion].correctA) {
      // this.setState(
      //   {
      //     correct: false,
      //     correctAnswer: questions[currentQuestion].correctA
      //   },
      //   () =>
      setTimeout(() => {
        this.setState(currentState => {
          const nextQuestion = currentState.currentQuestion + 1;
          const newScore = this.state.score === 0 ? 0 : currentState.score - 1;
          const newResults = [...currentState.quizResults];
          newResults.push([this.state.questions[currentQuestion], "incorrect"]);

          return {
            currentQuestion: nextQuestion,
            score: newScore,
            quizResults: newResults
            // correct: "",
            // correctAnswer: null,
            // index: null
          };
        });
      }, 700);
      //);
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
