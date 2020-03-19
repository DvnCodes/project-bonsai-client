import React, { Component } from "react";
import { Link, Redirect } from "@reach/router";
import {
  LobbyContainer,
  PlayerList,
  ChatMessageHistory,
  WallBG,
  PlayerLobbyCard
} from "../Styles/container.styles";
import { StyledButton, ChatForm } from "../Styles/ui.styles";
import ParallaxForest from "../Styles/ParallaxForest";

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
        <ParallaxForest />
        {this.state.everyoneReady === true && <Redirect noThrow to="/quiz" />}
        <h1>Game Lobby</h1>
        <LobbyContainer>
          <div className="LobbyControls">
            <h2>Online Players:</h2>
            <PlayerList>
              {this.state.currentLobbyGuests.map(guest => {
                return (
                  <PlayerLobbyCard key={guest.socket} ready={guest.ready}>
                    <p>{guest.username}</p>
                  </PlayerLobbyCard>
                );
              })}
            </PlayerList>
            <StyledButton
              onClick={this.readyUp}
              joinGame
              readytojoingame={this.checkOwnReadyStatus()}
            >
              {this.checkOwnReadyStatus()
                ? `waiting for ${4 -
                    this.checkHowManyPlayersReady()} other players`
                : "Join Game"}
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
  checkOwnReadyStatus = () => {
    const ownClient = this.state.currentLobbyGuests.find(guest => {
      return guest.socket === this.props.socket.id;
    });
    if (ownClient === undefined) return false;
    else return ownClient.ready;
  };
  checkHowManyPlayersReady = () => {
    const playerReadyCount = this.state.currentLobbyGuests.reduce(
      (acc, curr) => acc + (curr.ready === true && 1),
      0
    );
    return playerReadyCount;
  };
}

export default Lobby;
