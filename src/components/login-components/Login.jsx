import React from "react";
import io from "socket.io-client";

const socket = io("http://localhost", {
  path: "/8080"
});
class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };
  render() {
    const { username, password } = this.state;
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <input
            className="login-name-input"
            type="text"
            placeholder="enter username"
            value={username}
            name="username"
            onChange={this.handleInput}
          ></input>
          <input
            className="login-password-input"
            type="password"
            placeholder="enter password"
            value={password}
            name="password"
            onChange={this.handleInput}
          ></input>
          <button>log in</button>
        </form>
      </section>
    );
  }
  handleInput = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    console.log("submit");
    const { playerLogin } = this.props;
    event.preventDefault();
    playerLogin(); //sets state of App state loggedIn to true.
    socket.emit("newPlayerInLobby", players => {
      // send emit saying new player. receive list of current players in lobby from server. Set state with players in lobby.
      //playersInLobby(players)
    });

    this.setState({ username: "", password: "" });
  };
}

export default Login;
