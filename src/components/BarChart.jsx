// import React from "react";
import ReactApexChart from "react-apexcharts";
import React, { useState } from "react"

export function BarChart({data, title}) {
  const [categories, setCategories] = useState(data);
  console.log(categories[0]);
  const [state] = React.useState({
    title: title,
    series: [
      {
        name: "Budget",
        // data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        data: categories.filter(cat => cat.name != "Income").map(cat => cat.budget_amount)
      },
      {
        name: "Actual",
        // data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
        data: categories.filter(cat => cat.name != "Income").map(cat => cat.accumulated)
      }
    ],
    options: {
      chart: {
        type: "bar",
        height: 550,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        // categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        categories: categories.filter(cat => cat.name != "Income").map(cat => cat.name)
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (val) => "$ " + val + " thousands",
        },
      },
    },
  });

  return (
    <div id="chart">
      <h2>{state.title}</h2>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={550}
      />
      {/* <button onClick={()=>console.log(title)}>PRINT LOG 2</button> */}
    </div>
  );
};
