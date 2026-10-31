import React from "react";

// Props interface: describes the shape of the object passed to the component.
// TypeScript will enforce that a `name` of type `string` is always provided,
// and will flag any extra/mistyped props at call sites.
interface GreetingProps {
  name: string;
}

// Functional component typed with React.FC<GreetingProps>.
// Using React.FC gives us typed `props`, an implicit `children`,
// and a well-typed return value.
const Greeting: React.FC<GreetingProps> = ({ name }) => {
  return <div>Hello, {name}!</div>;
};

export default Greeting;
