import React from "react";
import { HealthBarContainer, HealthBarFill } from "../Styles/ui.styles";
import { PlayerStatsContainer } from "../Styles/container.styles";

const PlayerStatsPane = props => {
  return (
    <PlayerStatsContainer>
      <HealthBarContainer>
        <HealthBarFill healthPercentage={props.healthPercentage}>
          <div></div>
        </HealthBarFill>
      </HealthBarContainer>
    </PlayerStatsContainer>
  );
};

export default PlayerStatsPane;
