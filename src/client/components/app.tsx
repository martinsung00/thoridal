import * as React from "react";
import { Trade } from "../../server/types/trade";
import Header from "./Header";

interface Props {
  // To-do: Specify prop types
}

interface State {
  // To-do: Add more state types
  previousWeek: Array<Trade>;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      previousWeek: [],
    };
  }

  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}
