"use client";

import Modal from "@/components/modal";
import { useGetUser, useUpdateUser } from "@/hooks/user";
import { USER_ROLE, User } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";

function EditUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: user, isLoading: userLoading } = useGetUser(params.id);
  const { mutateAsync: updateUser, isPending: updatePending } = useUpdateUser(
    params.id
  );

  const handleUpdateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!user) return;

    const updatedUser: User = {
      ...user,
      email: data.get("email") as string,
      username: data.get("username") as string,
      role: data.get("is_admin") ? USER_ROLE.ADMIN : USER_ROLE.SALER,
    };

    await updateUser(updatedUser);
  };

  const loading = userLoading || !user || updatePending;
  return (
    <Modal>
      <Box
        sx={{ width: "100%" }}
        component="form"
        onSubmit={handleUpdateAccount}
      >
        <Typography variant="h5" sx={{ mb: 2 }} textAlign={"center"}>
          {lang["edit_user"]}
        </Typography>
        <TextField
          margin="normal"
          name="username"
          size="small"
          fullWidth
          required
          placeholder={lang["username"]}
          autoComplete="off"
          defaultValue={user?.username}
        />
        <TextField
          margin="normal"
          name="email"
          size="small"
          fullWidth
          required
          placeholder={lang["email"]}
          autoComplete="off"
          defaultValue={user?.email}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked={user?.role === USER_ROLE.ADMIN} />}
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

const lang = {
  edit_user: langFormat({
    en: "Edit User",
    ru: "Редактирование пользователя",
    uz: "Foydalanuvchi tahrirlash",
  }),
  username: langFormat({
    en: "User Name",
    ru: "Имя пользователя",
    uz: "Foydalanuvchi nomi",
  }),
  email: langFormat({
    en: "Email",
    ru: "Электронная почта",
    uz: "Elektron pochta",
  }),
  password: langFormat({ en: "Password", ru: "Пароль", uz: "Parol" }),
  save: langFormat({ en: "Save", ru: "Сохранить", uz: "Saqlash" }),
  is_admin: langFormat({ en: "Is Admin", ru: "Админ", uz: "Boshqaruvchi" }),
};

export default EditUser;
