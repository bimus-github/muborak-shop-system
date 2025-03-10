"use client";

import { useGetAllUsersOfOrganization } from "@/hooks/organization";
import { useDeleteUser, useGetCurrentUser, useLogout } from "@/hooks/user";
import { USER_ROLE, User } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import { Add, Delete, Edit, Pin } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function Accounts() {
  const router = useRouter();
  const { data: userData, isLoading: userLoading } = useGetCurrentUser();
  const { data: usersData, isLoading: usersLoading } =
    useGetAllUsersOfOrganization(userData?.user?.organizationId as string);

  const loading = userLoading || usersLoading;
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ mb: 1 }}>
        <Typography fontWeight={"bold"} textAlign={"center"} variant="h5">
          {lang["accounts"]}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <List>
          <ListItem divider>
            <ListItemText
              primary={"#"}
              sx={{ width: "5%" }}
              primaryTypographyProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
            />
            <ListItemText
              primary={lang["username"]}
              sx={{ width: "25%" }}
              primaryTypographyProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
            />
            <ListItemText
              primary={lang["email"]}
              sx={{ width: "25%" }}
              primaryTypographyProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
            />
            <ListItemText
              primary={lang["role"]}
              sx={{ width: "25%" }}
              primaryTypographyProps={{
                sx: {
                  fontWeight: "bold",
                },
              }}
            />
            <ListItemIcon sx={{ width: "25%" }} color="primary">
              {loading ? (
                <CircularProgress size={20} />
              ) : (
                <Tooltip title={lang["add"]}>
                  <IconButton
                    disabled={userData?.user?.role !== USER_ROLE.ADMIN}
                    onClick={() => router.push("/main/profile/add-user")}
                  >
                    <Add />
                  </IconButton>
                </Tooltip>
              )}
            </ListItemIcon>
          </ListItem>
          {usersData?.users.map((user: User, index: number) => (
            <UserItem key={user.email} user={user} index={index} />
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

const UserItem = ({ user, index }: { user: User; index: number }) => {
  const router = useRouter();
  const { data: userData } = useGetCurrentUser();
  const { mutateAsync: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutateAsync: logout, isPending: logoutPending } = useLogout();

  const handleLogout = async () => {
    const res = await logout();

    router.push("/auth/login");
  };

  async function handleDeleteUser() {
    if (!user?._id) return;

    toast((t) => (
      <Box>
        <Typography>{lang["are_you_sure_you_want_to_delete"]}</Typography>
        <Button
          color="error"
          onClick={async () => {
            const res = await deleteUser(user?._id!);

            toast.dismiss(t.id);
          }}
          disabled={isDeleting}
          endIcon={isDeleting ? <CircularProgress size={20} /> : undefined}
        >
          {lang["delete"]}
        </Button>
        <Button color="inherit" onClick={() => toast.dismiss(t.id)}>
          {lang["cancel"]}
        </Button>
      </Box>
    ));
  }
  return (
    <ListItem>
      <ListItemText sx={{ width: "5%" }} primary={index + 1} />
      <ListItemText
        sx={{ width: "25%" }}
        primary={user.username}
        secondary={userData?.user.username === user.username ? lang["you"] : ""}
      />
      <ListItemText sx={{ width: "25%" }} primary={user.email} />
      <ListItemText sx={{ width: "25%" }} primary={lang[user.role]} />
      <ListItemIcon sx={{ width: "25%" }} color="primary">
        <Tooltip title={lang["edit"]}>
          <IconButton
            onClick={() => router.push("/main/profile/edit-user/" + user?._id)}
            disabled={userData?.user?.role !== USER_ROLE.ADMIN}
          >
            <Edit />
          </IconButton>
        </Tooltip>
        <Tooltip title={lang["change_password"]}>
          <IconButton
            disabled={userData?.user?.role !== USER_ROLE.ADMIN}
            sx={{ ml: 1 }}
          >
            <Pin sx={{ color: "green" }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={lang["delete"]}>
          <IconButton
            disabled={userData?.user?.role !== USER_ROLE.ADMIN}
            sx={{ ml: 1 }}
            onClick={() => handleDeleteUser()}
          >
            <Delete sx={{ color: "red" }} />
          </IconButton>
        </Tooltip>
        {userData?.user.username === user.username && (
          <Button
            disabled={logoutPending}
            endIcon={logoutPending && <CircularProgress size={20} />}
            color="error"
            sx={{ ml: 1 }}
            onClick={handleLogout}
          >
            {lang["logout"]}
          </Button>
        )}
      </ListItemIcon>
    </ListItem>
  );
};

const lang = {
  admin: langFormat({ uz: "Boshqaruvchi", en: "Admin", ru: "Админ" }),
  saler: langFormat({ uz: "Sotuvchi", en: "Saler", ru: "Продавец" }),
  you: langFormat({ uz: "Siz", en: "You", ru: "Ты" }),
  accounts: langFormat({ uz: "Akauntlar", en: "Accounts", ru: "Аккаунты" }),
  username: langFormat({ uz: "Foydalanuvchi", en: "User", ru: "Пользователь" }),
  email: langFormat({
    uz: "Elektron pochta",
    en: "Email",
    ru: "Электронная почта",
  }),
  role: langFormat({ uz: "Rol", en: "Role", ru: "Роль" }),
  add: langFormat({ uz: "Qo'shish", en: "Add", ru: "Добавить" }),
  edit: langFormat({ uz: "Tahrirlash", en: "Edit", ru: "Изменить" }),
  delete: langFormat({ uz: "O'chirish", en: "Delete", ru: "Удалить" }),
  change_password: langFormat({
    uz: "Parolni o'zgartirish",
    en: "Change password",
    ru: "Изменить пароль",
  }),
  are_you_sure_you_want_to_delete: langFormat({
    uz: "Haqiqatan ham o`chirmoqchimisiz?",
    en: "Are you sure you want to delete?",
    ru: "Вы уверены, что хотите удалить?",
  }),
  cancel: langFormat({ uz: "Bekor qilish", en: "Cancel", ru: "Отмена" }),
  logout: langFormat({ uz: "Chiqish", en: "Logout", ru: "Выход" }),
};

export default Accounts;
