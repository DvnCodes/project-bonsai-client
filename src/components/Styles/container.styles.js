import styled from "styled-components";
import theme from "./themes";

export const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${theme.b};
  color: ${theme.e};
  z-index: 10;
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
