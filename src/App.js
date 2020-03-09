import React from "react";
import "./App.css";
import QuizPage from "./components/QuizPage";
import Login from "./components/login-components/Login";

class App extends React.Component {
  state = { test: false };
  render() {
    const { test } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Project Bonsai</h1>
          {!test && <Login changeTest={this.changeTest} />}
          {test && <QuizPage />}
        </header>
      </div>
    );
  }
  changeTest = () => {
    this.setState({ test: true });
  };
}

export default App;
