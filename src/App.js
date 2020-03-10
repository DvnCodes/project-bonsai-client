import React from "react";
import "./App.css";
import QuizPage from "./components/Quiz-components/QuizPage";
import { Router } from "@reach/router";
import Header from "./components/Header-components/Header";
import Login from "./components/login-components/Login";
import Lobby from "./components/Lobby-components/Lobby";
import socketIOClient from "socket.io-client";
const socket = socketIOClient("localhost:8080");

class App extends React.Component {
  state = { loggedIn: false, userList: null };

  componentDidMount() {}

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Header />
        </header>
        <body>
          <Router>
            <Login path="/" socket={socket} setUserList={this.setUserList} />
            <Lobby
              path="/lobby"
              userList={this.state.userList}
              socket={socket}
            />
            <QuizPage path="/quiz" users={this.state.users} socket={socket} />
          </Router>
        </body>
      </div>
    );
  }

  setUserList = userList => {
    console.log("setting userlist");

    this.setState({ userList });
  };
}

export default App;
