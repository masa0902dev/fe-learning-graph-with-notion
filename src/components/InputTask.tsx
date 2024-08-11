import { Box, Button, Input } from "@mui/material";
import { FC, useState } from "react";

const InputTask: FC = () => {
  const [task, setTask] = useState({
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
    <Box className="item-width input-wrapper">
      <Input
        type="text"
        value={task.input}
        onChange={handleInputChange}
        placeholder="Enter Task Name"
        color="success"
      />
      <Button
        variant="contained"
        color="success"
        onClick={handleClick}
        disabled={!task.input}
      >
        Set Task
      </Button>
    </Box>
  );
};
export default InputTask;
