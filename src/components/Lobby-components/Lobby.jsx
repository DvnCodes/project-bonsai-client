import React, { Component } from "react";

class Lobby extends Component {
  componentDidMount() {
    console.log(Object.keys(this.props.userList));
  }

  render() {
    return (
      <div>
        <h1>Lobby</h1>
        {!this.props.userList ? (
          <p>Loading players...</p>
        ) : (
          <>
            <p>Online Players:</p>
            <ul>
              {Object.keys(this.props.userList).map(userSocketID => {
                return (
                  <li key={userSocketID}>
                    {this.props.userList[userSocketID].username}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    );
  }

  // setUsers = userList => {
  //   this.setState({ userList });
  // };
}

export default Lobby;
