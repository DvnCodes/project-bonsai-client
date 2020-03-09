import React from "react";

class Login extends React.Component {
  state = {
    username: "",
    password: ""
  };
  render() {
    const { username, password } = this.state;
    return (
      <section>
        <form onSubmit={this.handleSubmit}>
          <input
            className="login-name-input"
            type="text"
            placeholder="enter username"
            value={username}
            name="username"
            onChange={this.handleInput}
          ></input>
          <input
            className="login-password-input"
            type="password"
            placeholder="enter password"
            value={password}
            name="password"
            onChange={this.handleInput}
          ></input>
          <button>log in</button>
        </form>
      </section>
    );
  }
  handleInput = event => {
    const { value, name } = event.target;
    console.log(value, name);
    this.setState({ [name]: value });
  };
  handleSubmit = event => {
    console.log("submit");
    const { changeTest } = this.props;
    event.preventDefault();
    changeTest();
    this.setState({ username: "", password: "" });
  };
}

export default Login;
