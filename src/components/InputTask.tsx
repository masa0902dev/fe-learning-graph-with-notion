import { Box, Button, Input } from "@mui/material";
import { FC } from "react";

interface InputTaskProps {
  task: {
    input: string;
    taskName: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

const InputTask: FC<InputTaskProps> = ({ task, handleInputChange, handleClick }) => {
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
