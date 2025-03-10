"use client";

import {
  useGetOrganization,
  useUpdateOrganization,
} from "@/hooks/organization";
import { useGetCurrentUser } from "@/hooks/user";
import { Organization as Organization_Type, USER_ROLE } from "@/models/types";
import { langFormat } from "@/utils/langFormat";
import {
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import toast from "react-hot-toast";

function Organization() {
  const { data: userData, isLoading: userLoading } = useGetCurrentUser();
  const { data: organizationData, isLoading: organizationLoading } = useGetOrganization(userData?.user?.organizationId as string);
  const { mutateAsync: updateOrganization, isPending: organizationPending } = useUpdateOrganization();

  const handleSaveOrganization = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!organizationData?.organization) return;

    const organization: Organization_Type = {
      ...(organizationData.organization as Organization_Type),
      name: data.get("organization") as string,
      phone: data.get("phone") as string,
      address: data.get("address") as string,
      messageId: data.get("message_id") as string,
    };

    const res = await updateOrganization(organization);

    if (res.success) {
      toast.success(langFormat(res.message));
    } else {
      toast.error(langFormat(res.message));
    }
  };

  const loading = userLoading || organizationLoading || organizationPending;

  return (
    <Grid
      component={"form"}
      container
      spacing={1}
      onSubmit={handleSaveOrganization}
    >
      <Grid item xs={12} sx={{ mb: 1 }}>
        <Typography fontWeight={"bold"} textAlign={"center"} variant="h5">
          {langFormat({
            uz: "Tashkilot",
            ru: "Организация",
            en: "Organization",
          })}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          defaultValue={organizationData?.organization?.name}
          margin="normal"
          name="organization"
          size="small"
          required
          sx={{ maxWidth: "400px", width: "100%", mx: "auto" }}
          placeholder={langFormat({
            en: "Organization",
            uz: "Tashkilot",
            ru: "Организация",
          })}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          defaultValue={organizationData?.organization?.phone}
          margin="normal"
          name="phone"
          size="small"
          required
          sx={{ maxWidth: "400px", width: "100%", mx: "auto" }}
          placeholder={langFormat({
            en: "Phone Number",
            uz: "Telefon Raqami",
            ru: "Номер Tелефона",
          })}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          defaultValue={organizationData?.organization?.messageId}
          margin="normal"
          name="message_id"
          size="small"
          required
          sx={{ maxWidth: "400px", width: "100%", mx: "auto" }}
          placeholder={'Telegram id'}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          defaultValue={organizationData?.organization?.address}
          margin="normal"
          name="address"
          size="small"
          required
          sx={{ maxWidth: "400px", width: "100%", mx: "auto" }}
          placeholder={langFormat({
            en: "Address",
            uz: "Manzil",
            ru: "Адрес",
          })}
          autoComplete="off"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={loading || userData?.user?.role !== USER_ROLE.ADMIN}
          type="submit"
          endIcon={loading && <CircularProgress size={20} />}
          variant="contained"
          color="secondary"
        >
          {langFormat({ uz: "Saqlash", ru: "Сохранить", en: "Save" })}
        </Button>
      </Grid>
    </Grid>
  );
}

export default Organization;
