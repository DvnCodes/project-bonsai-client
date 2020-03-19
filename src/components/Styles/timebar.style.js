import styled from "styled-components";
import theme from "./themes";

export const TimeBar = styled.h1`
  background: ${props =>
    props.time > 20
      ? theme.b
      : props.time < 20
      ? theme.a
      : props.time < 10
      ? theme.c
      : null};

  height: 4vh;
  animation: TimeBarAnimation 60s linear 1;

  @keyframes TimeBarAnimation {
    0% {
      width: 500px;
    }
    100% {
      width: 0px;
    }
  }
`;
