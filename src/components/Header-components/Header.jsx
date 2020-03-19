import React from "react";
import {
  HeaderContainer,
  MegaNotificationContainer
} from "../Styles/container.styles";
import { StyledButton } from "../Styles/ui.styles";
import { HeadingText } from "../Styles/text.styles";

const Header = props => {
  return (
    <HeaderContainer>
      <HeadingText>Qwizards</HeadingText>
      <StyledButton onClick={props.toggleAudio} audio>
        {props.audioMute ? (
          <img
            src="https://img.icons8.com/ios-glyphs/40/ffffff/mute.png"
            alt="audio mute"
          />
        ) : (
          <img
            src="https://img.icons8.com/ios-glyphs/40/ffffff/high-volume.png"
            alt="audio mute"
          />
        )}
      </StyledButton>
    </HeaderContainer>
  );
};

export default Header;
