"use client";

import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import React, { useEffect, useRef, useState, useTransition } from "react";
import { Print, QrCode } from "@mui/icons-material";
import { useReactToPrint } from "react-to-print";
import { Product } from "@/models/types";
import Barcode from "react-barcode";
import { langFormat } from "@/utils/langFormat";

import "./index.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function BarcodeModal({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const transition = useTransition();
  const [extraInfo, setExtraInfo] = useState(() => {
    return localStorage.getItem(`extraInfo`) || "";
  });
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => {
      return printRef.current;
    },
    pageStyle: "@page {quality: 100}",
  });

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handlePrint();
      }
    };

    document.addEventListener("keydown", keydown);

    return () => document.removeEventListener("keydown", keydown);
  }, [handlePrint]);

  return (
    <>
      <IconButton onClick={handleOpen}>
        <QrCode sx={{ fontSize: "20px" }} />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          component={"form"}
          onSubmit={(e) => {
            e.preventDefault();
            handlePrint();
          }}
        >
          <div className="container">
            <div ref={printRef} className="paper">
              <div className="small">
                {" "}
                <p className="item">{product.barcode}</p>
                <p className="item">{extraInfo}</p>
              </div>
              <p className="title">{product.name}</p>
            </div>
          </div>

          <TextField
            sx={{ marginTop: "15px" }}
            value={extraInfo}
            onChange={(e) => {
              setExtraInfo(e.target.value);

              transition[1](() => {
                localStorage.setItem("extraInfo", e.target.value);
              });
            }}
            variant="outlined"
            size="small"
            fullWidth
            placeholder={lang.extra_info}
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            size="small"
            sx={{ marginTop: "15px" }}
            variant="contained"
          >
            <Print /> Print {product?.barcode}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

const lang = {
  extra_info: langFormat({
    uz: "Qo'shimcha ma'lumot",
    ru: "Дополнительная информация",
    en: "Extra info",
  }),
};
