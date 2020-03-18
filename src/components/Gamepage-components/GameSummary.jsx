import React, { Component } from "react";
import { Link } from "@reach/router";
import { GameSummaryContainer } from "../Styles/container.styles";
import ParallaxForest from "../Styles/ParallaxForest";
import { StyledButton } from "../Styles/ui.styles";
import star from "../../assets/star2.png";

class GameSummary extends Component {
  state = { statsData: this.props.statsData };

  onClick = event => {
    this.props.socket.emit(
      "goLobbyFromGame",
      this.state.statsData[this.props.socket.id].rank
    );
  };

  render() {
    return (
      <>
        <ParallaxForest></ParallaxForest>
        <div>
          <h1>Game Summary</h1>
          <GameSummaryContainer>
            {Object.keys(this.state.statsData).map(ID => {
              return (
                this.state.statsData[ID].winner && (
                  <h1 key={ID}>
                    <img src={star}></img>
                    {this.state.statsData[ID].username} WINS!
                    <img src={star}></img>
                  </h1>
                )
              );
            })}

            <div>
              {Object.keys(this.state.statsData)
                .sort((a, b) => {
                  console.log(a);

                  return (
                    this.state.statsData[a].rank - this.state.statsData[b].rank
                  );
                })
                .map(ID => {
                  return (
                    <p key={ID} className="playerTile">
                      {this.state.statsData[ID].username} <br></br>
                      RANK: {this.state.statsData[ID].rank}
                      <br></br>
                      KILLS: {this.state.statsData[ID].kills}
                      <br></br>
                      HITS: {this.state.statsData[ID].hits}
                      <br></br>
                      ACCURACY:{" "}
                      {this.state.statsData[ID].spellsCast /
                        this.state.statsData[ID].hits}
                    </p>
                  );
                })}
            </div>
            <Link to="/lobby">
              <StyledButton>Return to Lobby</StyledButton>
            </Link>
          </GameSummaryContainer>
        </div>
      </>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.statsData === undefined &&
      this.props.statsData !== undefined
    ) {
      this.setState({ statsData: this.props.statsData });
      console.log("gamedata added to state");
    } else if (this.props.statsData !== prevProps.statsData) {
      this.setState({ statsData: this.props.statsData });
      console.log("gamedata added to state");
    }
  }

  componentDidMount() {
    this.props.socket.on("updateClientDetails", updatedDetails => {
      this.props.updateClientDetails(updatedDetails);
    });
  }

  componentWillUnmount() {
    this.props.socket.off("updateClientDetails");
  }
}

export default GameSummary;
