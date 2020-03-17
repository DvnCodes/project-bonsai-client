import styled from "styled-components";
import theme from "./themes";

export const StyledButton = styled.button`
  z-index: 2;
  margin: 3px 0;
  background-color: ${theme.a};
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 0px;
  font-family: "Press Start 2P", cursive;
  text-decoration: none;
  font-size: 16px;
  transition: all 0.2s ease;
  position: relative;
  &:active {
    box-shadow: inset 5px 5px 0px 0px rgba(0, 0, 0, 0.3);
  }

  box-shadow: inset -5px -5px 0px 0px rgba(0, 0, 0, 0.3);

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

export const LoginForm = styled.form`
  flex-grow: 0;
  z-index: 1;
  margin: auto;

  input {
    padding: 10px 20px;
    margin: 0 20px;
    border: solid black 3px;
    position: relative;
  }
`;

export const HealthBarFill = styled.div`
  background: ${theme.a};
  height: 6.8vh;
  border-radius: 6px;
  margin-right: 10px;
  margin-left: 10px;
  transition: width 0.5s ease;
  width: ${props => props.healthPercentage}%;

  div {
    background: rgba(255, 255, 255, 0.3);
    top: 5px;
    margin-top: 3px;
    margin-right: 3%;
    margin-left: 3%;
    height: 30%;
    width: 90%;
    border-radius: 3px;
  }
`;

export const HealthBarContainer = styled.div`
  position: relative;
  background-image: url("./assets/box.png");
  height: 10vh;
  width: 25vw;
  background-size: 100% 100%;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: center;
`;
