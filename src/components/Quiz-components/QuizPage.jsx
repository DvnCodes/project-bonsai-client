import React, { Component } from "react";
import Timer from "./Timer";
import QuizResultPage from "./QuizResultPage";

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
    quizOver: false
  };

  componentDidMount() {
    this.props.socket.emit("sendQuizQuestions");

    this.props.socket.on("beginQuiz", data => {
      console.log("REIEVED DATA", data);
      this.setState({ questions: data });
    });
  }
  render() {
    const { questions, currentQuestion } = this.state;
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
        {this.state.questions.length > 0 && (
          <>
            {!this.state.quizOver ? (
              <Timer seconds={5} timeUp={this.quizOver} />
            ) : (
              <>
                <h2>Game Starting in:</h2>
                <Timer seconds={10} timeUp={this.startGame} />
              </>
            )}
            {this.state.answeredAll ? (
              <QuizResultPage score={this.state.score} />
            ) : (
              <>
                <p>Score: {this.state.score}</p>

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

    if (e.target.innerText === questions[currentQuestion].correctA) {
      this.setState(currentState => {
        const nextQuestion = currentState.currentQuestion + 1;
        const newScore = currentState.score + 1;
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
  };
  startGame = () => {
    console.log("START GAME");
  };
}

export default QuizPage;
