"use client";
import React from "react";
import { Box, LinearProgress } from "@mui/material";

export default function CustomPageLoading({heigh = "100vh"}:{heigh?:string}) {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: heigh,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LinearProgress
        sx={{ width: "70%" }}
        variant="buffer"
        value={progress}
        valueBuffer={buffer}
      />
    </Box>
  );
}
