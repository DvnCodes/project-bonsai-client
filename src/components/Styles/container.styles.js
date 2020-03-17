import styled, { css } from "styled-components";
import theme from "./themes";

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${theme.b};
  color: ${theme.e};
  z-index: 10;
  position: relative;
`;

export const PrimaryContainer = styled.section`
  width: 100%;
  background-color: ${theme.e};
  flex-grow: 1;
  margin: 0;
  padding: 1.5em 0 0 0;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const MegaNotificationContainer = styled.aside`
  position: fixed;
  justify-self: center;
  top: 15%;
  padding: 5px 10px;
  margin: 0;
  background-color: ${theme.c};
  box-shadow: 6px 6px 0px ${theme.b};

  box-shadow: inset -5px -5px 0px 0px rgba(0, 0, 0, 0.3);
  z-index: -100;
  opacity: 0;

  animation-name: bang-in-out;
  animation-duration: 3s;
  animation-iteration-count: 1;

  @keyframes bang-in-out {
    0% {
      opacity: 0;
      z-index: 10;
      top: 0%;
    }
    15% {
      opacity: 1;
      top: 30%;
    }
    75% {
      opacity: 1;
      top: 30%;
    }
    99% {
      opacity: 0;
      top: 35%;
      z-index: 10;
    }
    100% {
      z-index: -100;
    }
  }

  h2 {
    font-family: "Press Start 2P";
    font-size: 4em;
    margin: 0 auto;
    color: ${theme.a};
    text-shadow: 6px 6px 0px ${theme.b};
    letter-spacing: 10px;
    line-height: 1.3em;
    text-transform: uppercase;
  }
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    top: -5px;
    left: 0;
    border-top: 5px black solid;
    border-bottom: 5px black solid;
  }

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    top: 0;
    left: -5px;
    border-left: 5px black solid;
    border-right: 5px black solid;
  }
`;

export const GameBorderUI = styled.div`
  .borderRight {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    width: 7vw;
    background-image: url("../../assets/right.png");
    background-size: 100% auto;
  }
  .borderLeft {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    width: 7vw;
    background-image: url("./assets/left.png");
    background-size: 100% auto;
  }
  .borderTop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 14vh;
    background-image: url("./assets/top.png");
    background-size: auto 100%;
  }
  .borderBottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 13vh;
    background-image: url("./assets/top.png");
    background-size: auto 100%;
    -moz-transform: scaleY(-1);
    -o-transform: scaleY(-1);
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
    filter: FlipV;
    -ms-filter: "FlipV";
  }
  .borderTopLeft {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    height: 26vh;
    width: 13vw;
    background-image: url("./assets/upperLeft.png");
    background-size: 100% 100%;
  }
  .borderTopRight {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    height: 26vh;
    width: 13vw;
    background-image: url("./assets/upperRight.png");
    background-size: 100% 100%;
  }
  .borderBottomLeft {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 26vh;
    width: 13vw;
    background-image: url("./assets/upperLeft.png");
    background-size: 100% 100%;
    -moz-transform: scaleY(-1);
    -o-transform: scaleY(-1);
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
    filter: FlipV;
    -ms-filter: "FlipV";
  }
  .borderBottomRight {
    position: fixed;
    bottom: 0;
    right: 0;
    height: 26vh;
    width: 13vw;
    background-image: url("./assets/upperRight.png");
    background-size: 100% 100%;
    -moz-transform: scaleY(-1);
    -o-transform: scaleY(-1);
    -webkit-transform: scaleY(-1);
    transform: scaleY(-1);
    filter: FlipV;
    -ms-filter: "FlipV";
  }
`;

export const PlayerStatsContainer = styled.aside`
  position: absolute;
  top: 0;
  right: 4vw;
`;

export const BarContainer = styled.section`
  width: ${props => props.val}%;
  background-color: ${props => props.color};
  height: 30px;
  border-radius: 4px;
  background-image: -webkit-linear-gradient(
    top,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.05)
  );
  background-image: -moz-linear-gradient(
    top,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.05)
  );
  background-image: -o-linear-gradient(
    top,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.05)
  );
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.05)
  );
  -webkit-transition: 2s linear;
  -moz-transition: 2s linear;
  -o-transition: 2s linear;
  transition: 2s linear;
  -webkit-transition-property: width, background-color;
  -moz-transition-property: width, background-color;
  -o-transition-property: width, background-color;
  transition-property: width, background-color;
  -webkit-box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25),
    inset 0 1px rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.25),
    inset 0 1px rgba(255, 255, 255, 0.1);
`;

export const QuizResultsContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "left right";
  #results {
    grid-area: left;
    list-style: none;
    justify-self: center;
  }
  #gameEffects {
    grid-area: right;
    justify-self: center;
  }
  #correct {
    color: green;
  }
  #incorrect {
    color: red;
  }
`;

export const WallBG = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url("./assets/wallTexture.png");
  background-size: 20%;
  background-repeat: repeat;
  z-index: 1;
`;

export const InstructionsBlock = styled.div`
  z-index: 3;
`;
