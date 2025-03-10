"use client";
import { langFormat } from "@/utils/langFormat";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  colors,
} from "@mui/material";
import React, { useState } from "react";
import BgColorSwitch from "../bg-color-switch";
import { LANGS } from "@/models/types";

function Settings() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("themeMode") === "dark";
  });
  const [lang, setLang] = useState<LANGS>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("lang") as LANGS) || LANGS.uz;
    }

    return LANGS.uz;
  });
  const [fontSize, setFontSize] = useState(() => {
    return Number(localStorage.getItem("fontSize")) || 16;
  });

  const handleSaveSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
      localStorage.setItem("themeMode", isDark ? "dark" : "light");
      localStorage.setItem("fontSize", fontSize.toString());
    }
  };

  return (
    <Grid
      component={"form"}
      container
      spacing={2}
      onSubmit={handleSaveSettings}
    >
      <Grid item xs={12} sx={{ mb: 1 }}>
        <Typography fontWeight={"bold"} textAlign={"center"} variant="h5">
          {langFormat({ uz: "Sozlamalar", en: "Settings", ru: "Настройки" })}
        </Typography>
      </Grid>
      <Grid item xs={4}>
        <Typography fontWeight={"bold"}>
          {langFormat({ uz: "Tema", en: "Theme", ru: "Тема" })}
        </Typography>
        <Box sx={{ m: 1 }}>
          <BgColorSwitch checked={isDark} onChange={() => setIsDark(!isDark)} />
        </Box>
      </Grid>
      <Grid item xs={4}>
        <Typography fontWeight={"bold"}>
          {langFormat({ uz: "Til", en: "Language", ru: "Язык" })}
        </Typography>
        <ButtonGroup variant="contained" sx={{ m: 1 }}>
          {Object.values(LANGS).map((l) => (
            <Button
              key={l}
              variant="contained"
              onClick={() => {
                setLang(l);
              }}
              type="button"
              sx={{
                bgcolor: lang === l ? colors.grey[500] : colors.blue[500],
                color: "white",
              }}
            >
              {l}
            </Button>
          ))}
        </ButtonGroup>
      </Grid>
      <Grid item xs={4}>
        <Typography fontWeight={"bold"}>
          {langFormat({ en: "Font Size", ru: "Размер шрифта", uz: "Shrift" })}
        </Typography>
        <TextField
          type="number"
          sx={{ m: 1 }}
          size="small"
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          sx={{ marginTop: "10px", marginRight: "10px" }}
          variant="contained"
          type="submit"
          color="secondary"
        >
          {langFormat({ uz: "Saqlash", ru: "Сохранить", en: "Save" })}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Settings;
