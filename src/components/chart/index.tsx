import React, { useRef, useLayoutEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export const CustomChart = () => {
  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "Example Chart",
    },
    series: [
      {
        name: "Data",
        data: [1, 2, 3, 4, 5],
      },
    ],
  };

  return (
    <div style={{ height: 100, width: "100%" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
