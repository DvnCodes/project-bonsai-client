import styled from "styled-components";
import theme from "./themes";

export const TimeBar = styled.div`
  height: 4vh;
  animation: TimeBarAnimation ${props => props.time}s linear 1;
  border: solid black 3px;
  -webkit-box-shadow: inset -3px -3px 0px 0px rgba(0, 0, 0, 0.3);
  box-shadow: inset -3px -3px 0px 0px rgba(0, 0, 0, 0.3);
  /* border: 1px solid black; */

  @keyframes TimeBarAnimation {
    0% {
      width: 500px;
      background: ${theme.b};
    }
    70% {
      background: ${theme.b};
    }
    72% {
      background: ${theme.a};
    }
    100% {
      width: 0px;
      background: ${theme.a};
    }
  }
`;
