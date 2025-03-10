"use client";

import * as React from "react";
import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

interface Props {
  children?: React.ReactNode;
  title: string;
  describtion?: string;
  defaultExpanded?: boolean;
}

export default function AccordionComponent(props: Props) {
  const [expanded, setExpanded] = React.useState<boolean>(
    !!props.defaultExpanded
  );

  return (
    <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography
            sx={{
              flexShrink: 0,
              fontWeight: "700",
              fontSize: "18px",
              // text capitalize
              textTransform: "capitalize",
              // one line
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {props.title}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            {props.describtion}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>{props.children}</AccordionDetails>
    </Accordion>
  );
}
