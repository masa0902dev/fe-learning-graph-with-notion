import { FC, useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { feTasks } from "../logic/fetchFETasks";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "基本情報技術者試験　学習時間",
    },
  },
};

type dataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

const ChartBar: FC = () => {
  const [data, setData] = useState<dataType>({
    labels: [],
    datasets: [
      {
        label: "Time",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    (async () => {
      const tasks = await feTasks;
      const labels = tasks.map((task) => task.date);
      const values = tasks.map((task) => task.sum);

      setData({
        labels: labels,
        datasets: [
          {
            label: "Time",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    })();
  }, []);

  return <Bar options={options} data={data} />;
};

export default ChartBar;
