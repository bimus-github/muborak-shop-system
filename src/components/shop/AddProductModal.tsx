import { useCreateProduct } from "@/hooks/product";
import { Product } from "@/models/types";
import { Add } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function AddProductModal() {
  const [product, setProduct] = useState<Product>({
    name: "",
    barcode: "",
    cost: 0,
    price: 0,
    count: 0,
    quantityPerBox: 0,
    userId: "",
    qrCodes: [],
  });
  const [open, setOpen] = React.useState(false);
  const { mutateAsync, isPending: isProductPending } = useCreateProduct();
  const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
  const handleClose = () => setOpen(false);

  const handleSaveProduct = async () => {
    await mutateAsync(product);
    handleClose();
  };
  return (
    <>
      <IconButton onClick={handleOpen}>
        <Add />
      </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.default",
            border: "2px solid",
            borderColor: "divider",
            p: 4,
          }}
          component={"form"}
        >
          <Typography>Mahsulot qo`shish</Typography>
          <TextField
            fullWidth
            size="small"
            margin="normal"
            placeholder="Mahsulot nomi"
            label="Mahsulot nomi"
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            value={product.name}
          />
          <TextField
            fullWidth
            size="small"
            margin="normal"
            placeholder="Mahsulot barcode"
            label="Mahsulot barcode"
            onChange={(e) =>
              setProduct({ ...product, barcode: e.target.value })
            }
            value={product.barcode}
          />
          <TextField
            fullWidth
            size="small"
            margin="normal"
            placeholder="Sotilish narxi"
            label="Sotilish narxi"
            type="number"
            onChange={(e) => setProduct({ ...product, cost: +e.target.value })}
            value={product.cost.toString()}
          />
          <Button
            disabled={isProductPending}
            variant="contained"
            onClick={handleSaveProduct}
          >
            Saqlash
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default AddProductModal;
