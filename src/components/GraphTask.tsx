import { FC, useState, useEffect } from "react";
import { Box } from "@mui/material";
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
import { fetchTasks, Task } from "../logic/fetchTasks";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface GraphTaskProps {
  taskName: string;
}

const GraphTask: FC<GraphTaskProps> = ({ taskName }) => {
  const [data, setData] = useState<DataType>({
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
      try {
        const tasks: Task[] = await fetchTasks(taskName);
        // データが日付で昇順なのを利用してデータ構造を初期化
        const firstDate = tasks[0].date;
        const lastDate = tasks[tasks.length - 1].date;
        const dateMap = new Map<string, number>();
        const tmpRoopDate = new Date(firstDate);
        while (tmpRoopDate <= new Date(lastDate)) {
          dateMap.set(tmpRoopDate.toISOString().split("T")[0], 0);
          tmpRoopDate.setDate(tmpRoopDate.getDate() + 1);
        }

        tasks.forEach((task) => {
          const sum = dateMap.get(task.date) || 0;
          dateMap.set(task.date, sum + task.sum);
        });

        const labels = Array.from(dateMap.keys());
        const values = Array.from(dateMap.values());
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
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    })();
  }, [taskName]);

  return (
    <Box className="task-graph-wrapper">
      <Bar options={options} data={data} className="task-graph" />
    </Box>
  );
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Notion Task Time",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Time (h)",
      },
    },
  },
};

type DataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

export default GraphTask;
