import React from "react";

const QuestionAndScore = props => {
  const { score, question } = props;
  return (
    <>
      <header className="score">Score: {score}</header>
      <main className="question">{question}?</main>
    </>
  );
};

export default QuestionAndScore;
