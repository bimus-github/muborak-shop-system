"use client";
import * as React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { langFormat } from "@/utils/langFormat";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LangFormat } from "@/models/types";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignIn() {
  const router = useRouter();
  const { isPending: loginPending, mutateAsync: login } = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      axios.post("/api/user/login", data),
  });
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const user: { email: string; password: string } = {
      email: data.get("email") as string,
      password: data.get("password") as string,
    };

    try {
      const res = await login(user);
      if (res) {
        // console.log(res.data);

        router.push("/main");
        toast.success(langFormat(res.data.message as LangFormat));
      }
    } catch (error: any) {
      const message = (error.response?.data.error as LangFormat) || {
        uz: "Nimadur xato",
        ru: "Произошла ошибка",
        en: "An error occurred",
      };
      console.log(error);

      toast.error(langFormat(message));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          {langFormat({ uz: "Kirish", ru: "Вход", en: "Sign In" })}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label={langFormat({
              uz: "Email",
              ru: "Электронная почта",
              en: "Email",
            })}
            placeholder={langFormat({
              uz: "Email",
              ru: "Электронная почта",
              en: "Email",
            })}
            name="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={langFormat({ uz: "Parol", ru: "Пароль", en: "Password" })}
            placeholder={langFormat({
              uz: "Parol",
              ru: "Пароль",
              en: "Password",
            })}
            type="password"
          />
          <Button
            startIcon={loginPending && <CircularProgress size={20} />}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loginPending}
          >
            {langFormat({ uz: "Kirish", ru: "Вход", en: "Sign In" })}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                {langFormat({
                  uz: "Parolni unutdingizmi?",
                  ru: "Забыли пароль?",
                  en: "Forgot password?",
                })}
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/signup" variant="body2">
                {langFormat({
                  uz: "Ro'yxatdan o'tish",
                  ru: "Регистрация",
                  en: "Sign Up",
                })}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
