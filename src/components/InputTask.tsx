import { Box, Button, Input } from "@mui/material";
import { FC, useRef } from "react";

interface InputTaskProps {
  task: {
    input: string;
    taskName: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

const InputTask: FC<InputTaskProps> = ({
  task,
  handleInputChange,
  handleClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && buttonRef.current) {
      buttonRef.current.focus();
      buttonRef.current.click();
    }
  };

  return (
    <Box className="item-width input-wrapper">
      <Input
        type="text"
        value={task.input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter Task Name"
        color="success"
      />
      <Button
        ref={buttonRef}
        onClick={handleClick}
        disabled={!task.input}
        variant="contained"
        color="success"
      >
        Set Task
      </Button>
    </Box>
  );
};

export default InputTask;
