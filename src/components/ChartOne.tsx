import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
Chart.register(CategoryScale);
type ChartsProps = {
  monthlyData: {
    users: number[];
  };
};
const ChartOne = ({ monthlyData}:ChartsProps ) => {
    const { users } = monthlyData;

  const [chartData, setChartData] = useState({
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    datasets: [
      {
        label: "Users",
        data: users,
        backgroundColor: "#7897FF",
        borderColor: "#7897FF",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  });

  useEffect(() => {
    setChartData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          data: users,
        },
      ],
    }));
  }, [users]);

  return (
    <div className="flex flex-col gap-5 w-full">
      <h3 className="text-lg font-semibold leading-6">
        Users Behaviour Analytics
      </h3>
      <div className="chart-container w-full h-[300px] sm:h-[400px] md:h-[500px] relative">
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Users per Month",
              },
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Users",
                },
                ticks: {
                  callback: (value) => `${value}`,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Months",
                },
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default ChartOne