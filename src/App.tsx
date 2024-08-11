import React, { useState } from "react";
import "./App.css";
import InputTask from "./components/InputTask";
import GraphTask from "./components/GraphTask";
import Author from "./components/Author";
import Description from "./components/Description";

function App() {
  type Task = {
    input: string;
    taskName: string;
  };
  const [task, setTask] = useState<Task>({
    input: "rails",
    taskName: "rails",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask({
      ...task,
      input: e.target.value,
    });
  };

  const handleClick = () => {
    setTask({
      ...task,
      taskName: task.input,
    });
  };

  return (
    <div className="App">
      <GraphTask
        taskName={task.taskName}
      />
      <InputTask
        task={task}
        handleInputChange={handleInputChange}
        handleClick={handleClick}
      />
      <Author />
      <Description />
    </div>
  );
}

export default App;
