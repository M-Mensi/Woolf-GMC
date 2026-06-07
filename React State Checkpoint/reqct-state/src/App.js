import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    person: {
      fullName: "Mohamed Mensi",
      bio: "Account Strategist @ Cognizant | Small & Medium Client Sales | Growth Hacker | MSc Candidate",
      imgSrc:
        "https://media.licdn.com/dms/image/v2/D4D03AQG04PSm3N3rvQ/profile-displayphoto-scale_400_400/B4DZzXEj81HEAg-/0/1773134824737?e=1782345600&v=beta&t=7jRyKHVANqTYITRTwYNucFGCNmaYeVYndeUwutz4TGw",
      profession: "Frontend Developer",
    },
    shows: false,
    elapsedSeconds: 0,
  };

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        elapsedSeconds: prevState.elapsedSeconds + 1,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  toggleProfile = () => {
    this.setState((prevState) => ({ shows: !prevState.shows }));
  };

  render() {
    const { person, shows, elapsedSeconds } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1>React State Checkpoint</h1>
          <button onClick={this.toggleProfile}>
            {shows ? "Hide Profile" : "Show Profile"}
          </button>
          <p>
            Mounted since: {elapsedSeconds} second
            {elapsedSeconds !== 1 ? "s" : ""}
          </p>
          {shows && (
            <div className="profile-card">
              <img
                src={person.imgSrc}
                alt={person.fullName}
                className="profile-image"
              />
              <h2>{person.fullName}</h2>
              <h4>{person.profession}</h4>
              <p>{person.bio}</p>
            </div>
          )}
        </header>
      </div>
    );
  }
}

export default App;
