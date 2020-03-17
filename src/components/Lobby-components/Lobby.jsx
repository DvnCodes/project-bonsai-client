import React, { Component } from "react";
import { Link, Redirect } from "@reach/router";
import {
  LobbyContainer,
  PlayerList,
  ChatMessageHistory,
  WallBG
} from "../Styles/container.styles";
import { StyledButton, ChatForm } from "../Styles/ui.styles";

class Lobby extends Component {
  state = {
    everyoneReady: false,
    chat: [],
    chatInput: "",
    currentLobbyGuests: []
  };
  render() {
    return !this.props.currentState.loggedIn ? (
      <Redirect noThrow to="/" />
    ) : (
      <>
        <WallBG></WallBG>
        {this.state.everyoneReady === true && <Redirect noThrow to="/quiz" />}
        <h1>Game Lobby</h1>
        <LobbyContainer>
          <div className="LobbyControls">
            <h2>Online Players:</h2>
            <PlayerList>
              {this.state.currentLobbyGuests.map(guest => {
                return (
                  <li key={guest.socket}>
                    <p>{guest.username}</p>
                  </li>
                );
              })}
            </PlayerList>
            <StyledButton onClick={this.readyUp} joinGame>
              Waiting for other players...
            </StyledButton>
          </div>
          <div className="LobbyMessaging">
            <ChatMessageHistory>
              {this.state.chat.map((comment, iteratee) => {
                return <li key={iteratee}>{comment}</li>;
              })}
            </ChatMessageHistory>
            <ChatForm onSubmit={this.sendMessage}>
              <input
                type="text"
                onChange={this.handleChange}
                value={this.state.chatInput}
              ></input>
              <StyledButton>Send</StyledButton>
            </ChatForm>
          </div>
        </LobbyContainer>

        <div>
          <h2>(2 peeps needed) Joining next game:</h2>
          <ul>
            {this.state.currentLobbyGuests.map(guest => {
              return (
                guest.ready && (
                  <li key={guest.socket}>
                    <p>{guest.username}</p>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </>
    );
  }
  componentDidMount() {
    //guests joining and leaving lobby messages

    this.props.socket.emit("joinedLobby");

    this.props.socket.on("currentLobbyGuests", lobbyGuests => {
      this.setState({
        currentLobbyGuests: lobbyGuests
      });
    });
    this.props.socket.on("newLobbyAddition", newGuest => {
      this.setState(currentState => {
        const updatedLobbyGuestList = [...currentState.currentLobbyGuests];
        updatedLobbyGuestList.push(newGuest);
        return {
          currentLobbyGuests: updatedLobbyGuestList
        };
      });
    });
    this.props.socket.on("updateClientDetails", updatedClientDetails => {
      this.props.updateClientDetails(updatedClientDetails);
    });
    this.props.socket.on("lobbyGuestStateUpdate", userDetails => {
      this.setState(currentState => {
        let lobbyGuestUpdate = [...currentState.currentLobbyGuests];
        if (userDetails.inLobby === false) {
          lobbyGuestUpdate = lobbyGuestUpdate.filter(user => {
            return user.socket !== userDetails.clientID;
          });
        } else {
          lobbyGuestUpdate = lobbyGuestUpdate.map(user => {
            if (user.socket === userDetails.socket) {
              return userDetails;
            } else return user;
          });
        }

        return { currentLobbyGuests: lobbyGuestUpdate };
      });
    });

    //lobby guests sending and receiving messages
    this.props.socket.on("playerJoinedLobbyNotification", data => {
      this.setState(currentState => {
        const updatedChatHistory = [...currentState.chat];
        updatedChatHistory.push(`${data.user}: ${data.message}`);
        return { chat: updatedChatHistory };
      });
    });
    this.props.socket.on("lobbyMessageBroadcast", data => {
      this.setState(currentState => {
        const updatedChatHistory = [...currentState.chat];
        updatedChatHistory.push(`${data.user}: ${data.message}`);
        return { chat: updatedChatHistory };
      });
    });

    //join next quiz messages
    this.props.socket.on("startGame", lobbyData => {
      this.setState({ everyoneReady: true });
    });
  }

  componentWillUnmount() {
    this.props.socket.off("startGame");
    this.props.socket.off("lobbyMessageBroadcast");
    this.props.socket.off("playerJoinedLobbyNotification");
    this.props.socket.off("currentLobbyGuests");
    this.props.socket.off("updateClientDetails");
    this.props.socket.off("lobbyGuestStateUpdate");
    this.props.socket.off("newLobbyAddition");
  }
  readyUp = () => {
    this.props.socket.emit("requestToJoinNextGame", "ready");
  };
  handleChange = event => {
    const { value } = event.target;
    this.setState({ chatInput: value });
  };
  sendMessage = event => {
    event.preventDefault();

    this.props.socket.emit("lobbyMessageSend", this.state.chatInput);
    this.setState({ chatInput: "" });
  };
}

export default Lobby;
