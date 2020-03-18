import React from "react";
import { Link } from "@reach/router";
import {
  PrimaryContainer,
  MegaNotificationContainer,
  InstructionsBlock
} from "../Styles/container.styles";
import { StyledButton, LoginForm } from "../Styles/ui.styles";
import ParallaxForest from "../Styles/ParallaxForest";

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
        <ParallaxForest />
        {this.state.loggedIn === false && (
          <LoginForm onSubmit={this.handleSubmit}>
            <input
              className="login-name-input"
              type="text"
              placeholder="enter username"
              value={username}
              name="username"
              onChange={this.handleInput}
              maxLength={15}
              required
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
          </LoginForm>
        )}
        {this.state.loggedIn === true && (
          <>
            <InstructionsBlock>
              <h2> Login Authorised...</h2>
              <h3>How To Play:</h3>
              <ul>
                <li>Chat in the lobby while you wait for players to join!</li>
                <li>
                  Answer as many questions as you can before the time runs out.
                </li>
                <li>
                  Each correct answer will make your wizard more powerful. Don't
                  just guess though, incorrect answers will weaken him.
                </li>
                <li>
                  The realms most mathematically adept wizards have gathered to
                  see who can be honoured as the true supreme mathmagician, you
                  must fire spells and dodge them until only one mage is left.
                </li>
              </ul>
            </InstructionsBlock>
            <InstructionsBlock>
              <h3>Controls:</h3>
              <ul>
                <li>Arrow keys to move</li>
                <li>Spacebar to fire</li>
                <li>E to shield momentarily against spells</li>
              </ul>
            </InstructionsBlock>

            <Link to="/lobby">
              <StyledButton>JOIN LOBBY</StyledButton>{" "}
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
      this.setState({ loggedIn: updatedClientDetails.loggedIn }, () => {
        this.props.updateClientDetails(updatedClientDetails);
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {}
}

// new user button, rendering a create account component?

export default Login;
