import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container } from "react-bootstrap";
import Name from "./Name";
import Price from "./Price";
import Description from "./Description";
import Image from "./Image";
import product from "./product";

const firstName = "Mensi";

function App() {
  return (
    <>
      <Container className="my-5">
        <Card className="mx-auto" style={{ maxWidth: "540px" }}>
          <Card.Header className="bg-primary text-white">
            Product Details
          </Card.Header>
          <Card.Body>
            <Image />
            <Card.Title className="mt-3">
              <Name />
            </Card.Title>
            <Price />
            <Description />
          </Card.Body>
        </Card>

        <div className="mt-4 text-center">
          <p className="fs-5">
            {firstName ? `Hello, ${firstName}!` : "Hello, there!"}
          </p>
          {firstName && (
            <img
              src={product.image}
              alt="Welcome"
              className="img-fluid rounded"
              style={{ maxWidth: "320px" }}
            />
          )}
        </div>
      </Container>
    </>
  );
}

export default App;
