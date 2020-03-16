import styled from "styled-components";
import theme from "./themes";

export const StyledButton = styled.button`
  margin: 3px 0;
  background-color: ${theme.d};
  color: ${theme.a};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.5s ease;
  &:hover {
    background-color: ${theme.b};
    color: ${theme.e};
  }
  &:active {
    position: relative;
    top: 2px;
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
