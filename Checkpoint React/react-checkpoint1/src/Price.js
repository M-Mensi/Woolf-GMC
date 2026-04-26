import product from "./product";

function Price() {
  return (
    <p className="mb-2">
      <strong>Price:</strong> {product.price}
    </p>
  );
}

export default Price;
