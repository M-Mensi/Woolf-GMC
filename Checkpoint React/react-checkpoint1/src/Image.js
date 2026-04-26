import product from "./product";

function Image() {
  return (
    <img src={product.image} alt={product.name} className="img-fluid rounded" />
  );
}

export default Image;
