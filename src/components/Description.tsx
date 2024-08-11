import React from "react";
import { Box, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Description: React.FC = () => {
  return (
    <Box className="item-width">
      <Accordion defaultExpanded className="item-bg description">
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>What's This?</AccordionSummary>
        <AccordionDetails>
          This is a simple graph that shows the time spent on some tasks for masa0902dev.
          By default, it shows the time spend on learning Ruby on Rails.
          <br></br>
          The data is fetched from Notion API and displayed using Chart.js.
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
export default Description;
