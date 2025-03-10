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
import { useMutation } from "@tanstack/react-query";
import { LangFormat, Organization, USER_ROLE, User } from "@/models/types";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreateOrganization } from "@/hooks/organization";

export default function SignUp() {
  const router = useRouter();
  const { mutateAsync: signUp, isPending: signUpPending } = useMutation({
    mutationFn: (data: User) => axios.post("/api/user/signup", data),
  });
  const {
    mutateAsync: createOrganization,
    isPending: createOrganizationPending,
  } = useCreateOrganization();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newOrganization: Organization = {
      name: data.get("organization") as string,
      address: data.get("address") as string,
      phone: data.get("phone") as string,
    };

    const resOrganization = await createOrganization(newOrganization);

    if (resOrganization.success) {
      // toast.success(resOrganization.message);
      const user: User = {
        username: data.get("username") as string,
        email: data.get("email") as string,
        organizationId: resOrganization.organization._id,
        password: data.get("password") as string,
        role: USER_ROLE.ADMIN,
      };

      try {
        const res = await signUp(user);
        if (res) {
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
    }
  };

  const isLodading = signUpPending || createOrganizationPending;

  return (
    <Container component="main" maxWidth="md">
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
          {langFormat({
            uz: "Ro'yxatdan o'tish",
            ru: "Регистрация",
            en: "Sign Up",
          })}
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                name="username"
                required
                fullWidth
                label={langFormat({
                  en: "Username",
                  uz: "Foydalanuvchi ismi",
                  ru: "Имя пользователя",
                })}
                placeholder={langFormat({
                  en: "Username",
                  uz: "Foydalanuvchi ismi",
                  ru: "Имя пользователя",
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                margin="normal"
                name="organization"
                required
                fullWidth
                label={langFormat({
                  en: "Organization",
                  uz: "Tashkilot",
                  ru: "Организация",
                })}
                placeholder={langFormat({
                  en: "Organization",
                  uz: "Tashkilot",
                  ru: "Организация",
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                margin="normal"
                name="phone"
                required
                fullWidth
                label={langFormat({
                  en: "Phone Number",
                  uz: "Telefon Raqami",
                  ru: "Номер Tелефона",
                })}
                placeholder={langFormat({
                  en: "Phone Number",
                  uz: "Telefon Raqami",
                  ru: "Номер Tелефона",
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                margin="normal"
                name="address"
                required
                fullWidth
                label={langFormat({
                  en: "Address",
                  uz: "Manzil",
                  ru: "Адрес",
                })}
                placeholder={langFormat({
                  en: "Address",
                  uz: "Manzil",
                  ru: "Адрес",
                })}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                label={langFormat({
                  en: "Email Address",
                  uz: "Email manzili",
                  ru: "Адрес электронной почты",
                })}
                placeholder={langFormat({
                  en: "Email Address",
                  uz: "Email manzili",
                  ru: "Адрес электронной почты",
                })}
                name="email"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={langFormat({
                  en: "Password",
                  uz: "Parol",
                  ru: "Пароль",
                })}
                placeholder={langFormat({
                  en: "Password",
                  uz: "Parol",
                  ru: "Пароль",
                })}
                type="password"
              />
            </Grid>
          </Grid>
          <Button
            startIcon={isLodading && <CircularProgress size={20} />}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLodading}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
