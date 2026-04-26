import React from "react";
import Player from "./Player";
import players from "./players";

const PlayersList = () => {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: "20px",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh"
  };

  const headingStyle = {
    width: "100%",
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "30px",
    marginTop: "20px"
  };

  return (
    <div>
      <h1 style={headingStyle}>⚽ FIFA Player Cards</h1>
      <div style={containerStyle}>
        {players.map((player, index) => (
          <Player key={index} {...player} />
        ))}
      </div>
    </div>
  );
};

export default PlayersList;
