"use client";

import { Box, Modal as MuiModal } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { createPortal } from "react-dom";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open] = useState(true);
  const handleClose = () => router.back();

  return createPortal(
    <MuiModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </MuiModal>,
    document.getElementById("modal-root")!
  );
}

export default Modal;
