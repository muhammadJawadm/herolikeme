import React from "react";
import { Pie } from "react-chartjs-2";
interface PieChartBoxProps {
  title: string;
  chartData: {
    labels: string[];
    values: number[];
  };
  className?: string;
}


const PieChartBox: React.FC<PieChartBoxProps> = ({ title, chartData, className }) => {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: title,
        data: chartData.values,
        backgroundColor: [
          "#4F46E5", // indigo
          "#10B981", // emerald
          "#F59E0B", // amber
          "#EF4444", // red
          "#8B5CF6", // violet
          "#EC4899", // pink
        ],
        borderWidth: 2,
        borderColor: "#FFFFFF",
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className={`p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
};
export default PieChartBox;
