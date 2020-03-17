import React from "react";
import { HeaderContainer } from "../Styles/container.styles";

const Header = props => {
  return (
    <HeaderContainer>
      <h1>Dungeon Mathsters</h1>
      <button onClick={props.toggleAudio}>toggle audio</button>
    </HeaderContainer>
  );
};

export default Header;
