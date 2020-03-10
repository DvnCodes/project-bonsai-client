import React, { Component } from "react";

class Lobby extends Component {
  state = { users: null, loading: true };
  render() {
    return (
      <div>
        <h1>Quiz Lobby</h1>
        {this.state.loading === false ? (
          <ul>
            {Object.keys(this.state.users).map(userObj => {
              console.log("here");
              return <li>{userObj[this.props.socket.id]}</li>;
            })}
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
  setUsers = () => {};
}

export default Lobby;
