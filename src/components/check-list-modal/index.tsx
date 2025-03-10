"use client";
import React from "react";
import { Box, Modal, Button } from "@mui/material";
import { useGetRoom } from "@/hooks/room";
import { langFormat } from "@/utils/langFormat";
import { Print } from "@mui/icons-material";
import "./index.css";
import { useReactToPrint } from "react-to-print";
import { useGetCurrentUser } from "@/hooks/user";
import { useGetOrganization } from "@/hooks/organization";

function CheckListModal({ roomId }: { roomId: string }) {
  const printRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const { data: roomData } = useGetRoom(roomId);
  const { saledProducts } = roomData?.room || {};
  const { data: userData } = useGetCurrentUser();
  const { data: organizationData } = useGetOrganization(
    userData?.user.organizationId as string
  );

  const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
  const handleClose = () => setOpen(false);

  const handlePrint = useReactToPrint({
    content: () => {
      return printRef.current;
    },
    pageStyle: "@page {quality: 100%}",
  });

  React.useEffect(() => {
    const keyboarFunction = async (e: KeyboardEvent) => {
      switch (e.key) {
        case "F6": {
          handleOpen();
          break;
        }
        case "F7": {
          handlePrint();
          break;
        }
      }
    };

    document.addEventListener("keydown", keyboarFunction);

    return () => {
      document.removeEventListener("keydown", keyboarFunction);
    };
  }, [handlePrint, handleOpen]);

  return (
    <>
      <Button color="secondary" onClick={handleOpen}>
        {lang["check"]} [F6]
      </Button>
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
          <div className="container">
            <div ref={printRef} className="paper">
              <p className="title">{organizationData?.organization?.name}</p>
              <p className="small">
                TEL: {organizationData?.organization?.phone} <br />
                {lang["address"]}: {organizationData?.organization?.address}
              </p>

              {saledProducts?.length !== 0 && (
                <React.Fragment key={roomId}>
                  <p className="small date">
                    {lang["date"]}: {new Date().toLocaleString("ru-RU")}
                  </p>
                  <hr />
                  {saledProducts?.map((product, index) => (
                    <div key={product._id} className="item">
                      <p className="name">
                        {index + 1}. {product.name}
                      </p>
                      <p className="price">
                        {product.saledPrice.toLocaleString("ru-RU")} X{" "}
                        {product.quantity}
                      </p>
                    </div>
                  ))}
                  <hr />
                  <p className="total">
                    {langFormat({ en: "Total", uz: "Jami", ru: "Всего" })}:{" "}
                    {saledProducts
                      ?.reduce((a, b) => a + b.saledPrice * b.quantity, 0)
                      .toLocaleString("ru-RU") + " " + lang["som"]} 
                  </p>
                  <p className="small" style={{ marginBottom: "10px" }}>
                    {lang["thanks"]}
                  </p>{" "}
                </React.Fragment>
              )}
              <p className="brand">{process.env.NEXT_PUBLIC_AD_INFO}</p>
            </div>
          </div>

          <Button
            type="button"
            fullWidth
            size="small"
            sx={{ marginTop: "15px" }}
            variant="contained"
            onClick={handlePrint}
          >
            <Print /> {lang["print"]}
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default CheckListModal;

const lang = {
  check: langFormat({ en: "Check List", uz: "Check List", ru: "Чек-лист" }),
  print: langFormat({ en: "Print", uz: "Print", ru: "Печать" }),
  address: langFormat({ en: "Address", uz: "Address", ru: "Адрес" }),
  date: langFormat({ en: "Date", uz: "Date", ru: "Дата" }),
  thanks: langFormat({
    en: "Thanks for your purchase",
    uz: "Haridingiz uchun rahmat",
    ru: "Спасибо за покупку",
  }),
  som: langFormat({ uz: "so'm", ru: "сум", en: "sum" }),
};
