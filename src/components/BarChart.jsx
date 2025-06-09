import ReactApexChart from "react-apexcharts";

export function BarChart({data, title}) {
  const filteredData = data.filter(cat => cat.name !== "Income");
    const series = [
      {
        name: "Budget",
        data: filteredData.map(cat => cat.budget_amount)
      },
      {
        name: "Actual",
        data: filteredData.map(cat => cat.accumulated)
      },
    ];
    const options = {
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
        categories: filteredData.map(cat => cat.name)
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
    };

  return (
    <div id="chart">
      <h2>{title}</h2>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={550}
      />
    </div>
  );
};
