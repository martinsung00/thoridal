import React from "react";
import renderer from "react-test-renderer";
import { Metrics } from "../../../../src/client/components/metrics_components/Metrics";

describe("Metrics Dashboard Tests", function () {
  const positiveNet = {
    net: 1,
    totalWeekTrades: 1,
    totalFulfilled: 1,
    totalUnfulfilled: 1,
    avgGainPerDay: 1,
    avgTradePerDay: 1,
  };

  const negativeNet = {
    net: -1,
    totalWeekTrades: 1,
    totalFulfilled: 1,
    totalUnfulfilled: 1,
    avgGainPerDay: -1,
    avgTradePerDay: 1,
  };

  it("should render all the elements with the given props (positive net)", function (done) {
    const container = renderer.create(<Metrics {...positiveNet} />).toJSON();
    expect(container).toMatchSnapshot();

    done();
  });

  it("should render all the elements with the given props (negative net)", function (done) {
    const container = renderer.create(<Metrics {...negativeNet} />).toJSON();
    expect(container).toMatchSnapshot();

    done();
  });
});
