import React, { Component } from "react";

// Props interface — currently empty because Counter takes no props,
// but declared so it can be extended later without touching the class signature.
interface CounterProps {}

// State interface — describes the shape of `this.state`.
// Making it explicit ensures `setState` rejects any typo like `{ cunt: 1 }`.
interface CounterState {
  count: number;
}

// Generic parameters: <Props, State>.
// `Component<CounterProps, CounterState>` gives `this.props` and `this.state`
// full type information throughout the class.
class Counter extends Component<CounterProps, CounterState> {
  // Explicitly type the initial state.
  state: CounterState = {
    count: 0,
  };

  // Annotate the arrow function's return type.
  // Arrow functions preserve `this` binding, so we still use them here
  // (equivalent to calling .bind(this) in the constructor).
  increment = (): void => {
    this.setState({ count: this.state.count + 1 });
  };

  // render()'s return type is inferred as JSX.Element by TypeScript.
  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
