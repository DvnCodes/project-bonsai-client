import React from "react";
import { Link } from "@reach/router";
import {
  PrimaryContainer,
  MegaNotificationContainer
} from "../Styles/container.styles";
import { StyledButton } from "../Styles/ui.styles";

class Login extends React.Component {
  state = {
    loggedIn: false,
    username: "",
    password: ""
  };
  render() {
    const { username } = this.state;
    return (
      <PrimaryContainer>
        {this.state.loggedIn === false && (
          <form onSubmit={this.handleSubmit}>
            <input
              className="login-name-input"
              type="text"
              placeholder="enter username"
              value={username}
              name="username"
              onChange={this.handleInput}
            ></input>
            {/* <input
              className="login-password-input"
              type="password"
              placeholder="enter password"
              value={password}
              name="password"
              onChange={this.handleInput}
            ></input> */}

            <StyledButton>log in</StyledButton>
          </form>
        )}
        {this.state.loggedIn === true && (
          <>
            <p> Login Authorised..</p>
            <Link to="/lobby">
              <button>JOIN LOBBY</button>{" "}
            </Link>
          </>
        )}
      </PrimaryContainer>
    );
    /* / Lobby link - on submit emits a 'player login' message, which the server will
       listen out for and send a response. When the login is authorised or
       unauthorised the sever emits back the response. The user is then
       linked to the Lobby page, depending on the server response.*/
  }
  handleInput = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { username } = this.state;
    event.preventDefault();

    this.props.socket.emit("playerLogin", username);
    // send emit saying new player. receive list of current players in lobby from server. Set state with players in lobby.
    //playersInLobby(players)
    this.setState({ username: "", password: "" });
  };

  componentDidMount() {
    this.props.socket.on("loginAuthorised", updatedClientDetails => {
      console.log(updatedClientDetails);
      this.setState({ loggedIn: updatedClientDetails.loggedIn }, () => {
        this.props.updateClientDetails(updatedClientDetails);
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {}
}

// new user button, rendering a create account component?

export default Login;
