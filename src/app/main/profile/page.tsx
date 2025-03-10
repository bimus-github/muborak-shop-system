"use client";
import { Box, Divider } from "@mui/material";
import React from "react";
import Settings from "@/components/profile/Settings";
import Organization from "@/components/profile/Organization";
import Accounts from "@/components/profile/Accounts";
// import axios from "axios";
// import toast from "react-hot-toast";

function Profile() {
  // const handleSaveProducts = async () => {
  //   const res = await axios.post("/api/main/data").then((res) => res.data);

  //   if (res.success) {
  //     toast.success("Saved");
  //   }
  // };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* <Button onClick={handleSaveProducts}>Save</Button> */}
      <Settings />
      <Divider />
      <Organization />
      <Divider />
      <Accounts />
    </Box>
  );
}

export default Profile;
