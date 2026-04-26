import React from "react";
import Card from "react-bootstrap/Card";

const Player = ({
  name = "Unknown Player",
  team = "Unknown Team",
  nationality = "Unknown",
  jerseyNumber = 0,
  age = 0,
  image = "https://via.placeholder.com/150"
}) => {
  const cardStyle = {
    width: "18rem",
    margin: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    transition: "transform 0.3s ease, boxShadow 0.3s ease",
    cursor: "pointer"
  };

  const imageStyle = {
    height: "200px",
    objectFit: "cover"
  };

  const cardBodyStyle = {
    textAlign: "center"
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px"
  };

  const textStyle = {
    color: "#666",
    marginBottom: "8px",
    fontSize: "0.95rem"
  };

  const jerseyStyle = {
    display: "inline-block",
    backgroundColor: "#1976d2",
    color: "white",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    lineHeight: "40px",
    fontWeight: "bold",
    marginTop: "10px"
  };

  return (
    <div style={cardStyle} className="player-card">
      <Card>
        <Card.Img variant="top" src={image} style={imageStyle} alt={name} />
        <Card.Body style={cardBodyStyle}>
          <Card.Title style={titleStyle}>{name}</Card.Title>
          <Card.Text style={textStyle}>
            <strong>Team:</strong> {team}
          </Card.Text>
          <Card.Text style={textStyle}>
            <strong>Nationality:</strong> {nationality}
          </Card.Text>
          <Card.Text style={textStyle}>
            <strong>Age:</strong> {age} years
          </Card.Text>
          <div style={jerseyStyle}>#{jerseyNumber}</div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Player;
