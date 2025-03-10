"use client";

import React from "react";
import Modal from "@/components/modal";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { langFormat } from "@/utils/langFormat";
import { LangFormat, USER_ROLE, User } from "@/models/types";
import { useGetCurrentUser } from "@/hooks/user";
import { useCreateUser } from "@/hooks/organization";
import toast from "react-hot-toast";

function AddUser() {
  const { data: userData, isLoading: userLoading } = useGetCurrentUser();
  const { mutateAsync: createUser, isPending: createUserPending } =
    useCreateUser();
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userData?.user) return;
    const data = new FormData(e.currentTarget);

    const user: User = {
      organizationId: userData?.user.organizationId,
      email: data.get("email") as string,
      password: data.get("password") as string,
      role: data.get("is_admin") ? USER_ROLE.ADMIN : USER_ROLE.SALER,
      username: data.get("username") as string,
    };

    try {
      const res = await createUser(user);

      if (res.data?.success) {
        toast.success(lang["is_created"]);
      }
    } catch (error: any) {
      console.log(error?.response?.data?.error);

      toast.error(
        langFormat(error?.response?.data?.error as LangFormat) || lang["error"]
      );
    }
    e.currentTarget.reset();
  };

  const loading = userLoading || createUserPending;
  return (
    <Modal>
      <Box
        sx={{ width: "100%" }}
        component="form"
        onSubmit={handleCreateAccount}
      >
        <Typography variant="h5" sx={{ mb: 2 }} textAlign={"center"}>
          {lang["create_account"]}
        </Typography>
        <TextField
          margin="normal"
          name="username"
          size="small"
          fullWidth
          required
          placeholder={lang["username"]}
          label={lang["username"]}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          name="email"
          size="small"
          fullWidth
          required
          placeholder={lang["email"]}
          label={lang["email"]}
          autoComplete="off"
        />
        <TextField
          margin="normal"
          name="password"
          type="password"
          size="small"
          fullWidth
          required
          placeholder={lang["password"]}
          label={lang["password"]}
          autoComplete="off"
        />
        <FormControlLabel
          control={<Checkbox />}
          label={lang["is_admin"]}
          name="is_admin"
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          size="small"
          fullWidth
          type="submit"
          disabled={loading}
          endIcon={loading && <CircularProgress size={20} />}
        >
          {lang["save"]}
        </Button>
      </Box>
    </Modal>
  );
}

export default AddUser;

const lang = {
  create_account: langFormat({
    uz: "Akaunt Yaratish",
    ru: "Создание аккаунта",
    en: "Create Account",
  }),
  username: langFormat({
    uz: "Foydalanuvchi nomi",
    ru: "Имя пользователя",
    en: "User Name",
  }),
  email: langFormat({
    uz: "Elektron pochta",
    ru: "Электронная почта",
    en: "Email",
  }),
  password: langFormat({
    uz: "Parol",
    ru: "Пароль",
    en: "Password",
  }),
  save: langFormat({
    uz: "Saqlash",
    ru: "Сохранить",
    en: "Save",
  }),
  is_admin: langFormat({
    uz: "Boshqaruvchi",
    ru: "Админ",
    en: "Admin",
  }),
  is_created: langFormat({
    uz: "Yaratildi",
    ru: "Создан",
    en: "Created",
  }),
  error: langFormat({
    uz: "Xatolik",
    ru: "Ошибка",
    en: "Error",
  }),
};
