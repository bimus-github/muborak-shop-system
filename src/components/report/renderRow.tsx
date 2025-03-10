import * as React from "react";
import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { ListChildComponentProps } from "react-window";
import { LangFormat } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { multiDigitNumberFormat } from "@/utils/multiDigitNumberFormat";

export const item = {
  title: (text: LangFormat) => langFormat(text),
  extra: (text: LangFormat) => langFormat(text),
  value: (value: number) =>
    multiDigitNumberFormat(value) +
    " " +
    langFormat({ uz: "so'm", en: "so'm", ru: "сум" }),
};

export function renderRow(props: ListChildComponentProps) {
  const { index, style, data } = props;
  return (
    <ListItem
      style={{
        ...style,
        borderBottom: "1px solid",
        borderColor: index + 1 === data.length ? "transparent" : "lightgrey",
      }}
      component="div"
      key={index}
      disablePadding
    >
      <ListItemButton sx={{ ":hover": { backgroundColor: "transparent" } }}>
        <ListItemText
          secondary={data[index]?.extra}
          primary={data[index]?.title}
          primaryTypographyProps={{
            sx: {
              fontWeight: "500",
              fontSize: "20px",
            },
          }}
          sx={{
            width: "400px",
          }}
        />
        <ListItemText
          primaryTypographyProps={{
            sx: {
              fontWeight: "500",
              fontSize: "20px",
            },
          }}
          sx={{
            width: "200px",
          }}
          primary={data[index]?.value}
        />
      </ListItemButton>
    </ListItem>
  );
}
