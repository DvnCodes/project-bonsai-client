import React from "react";
import { ParallaxForestContainer } from "./container.styles";

class ParallaxForest extends React.Component {
  constructor(props) {
    super(props);
    this.heightRef = React.createRef();
    this.state = {
      componentHeight: 0
    };
  }

  componentDidMount = () => {
    this.setState({ componentHeight: this.heightRef.current.clientHeight });
  };

  render() {
    return (
      <ParallaxForestContainer
        ref={this.heightRef}
        componentHeight={this.state.componentHeight}
      >
        <div className="PFLayerTwo"></div>
        <div className="PFLayerThree"></div>
        <div className="PFLayerFour"></div>
        <div className="PFLayerFive"></div>
        <div className="PFLayerSix"></div>
        <div className="PFLayerSeven"></div>
        <div className="PFLayerEight"></div>
        <div className="PFLayerNine"></div>
        <div className="PFLayerTen"></div>
      </ParallaxForestContainer>
    );
  }
}

export default ParallaxForest;
