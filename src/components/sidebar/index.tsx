"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { isNotAdminSideBarRoutes, sideBarRoutes } from "@/constants/routes";
import { Box, CircularProgress, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Tooltip, Typography, } from "@mui/material";
import { AppBar, DrawerHeader, Main, drawerWidth } from "./Helpers";
import { ChevronLeft, ChevronRight, Menu } from "@mui/icons-material";
import { langFormat } from "@/utils/langFormat";
import { useGetCurrentUser } from "@/hooks/user";
import { USER_ROLE } from "@/models/types";

import {Astloch} from '@next/font/google'

const astloch = Astloch({
  weight: '400',
  subsets: ['latin'],
})

export default function SideBar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { data: userData, isLoading: userLoading } = useGetCurrentUser();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (typeof window === "undefined") return null;
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            {userLoading ? <CircularProgress size={25} /> : <Menu />}
          </IconButton>

          <Typography
            sx={{
              fontSize: "22px",
            }}
          >
            {sideBarRoutes.find((route) => route.to === pathname)?.name}
          </Typography>

          <Tooltip
            title={langFormat({ uz: "Bosh sahifaga qaytish", ru: "Вернуться на главную", en: "Back to main page", })}
          >
            <Typography
              onClick={() => router.push("/")}
              sx={{ ml: "auto", fontSize: "30px", fontFamily: astloch.style.fontFamily, fontWeight: "bold", textShadow: "1px 1px 1px #000", border: "1px solid", borderColor: "divider", borderRadius: "15px", px: "10px", cursor: "pointer", transition: "all 0.3s", "&:hover": { color: "primary.main" }}}
            >
              Shop System
            </Typography>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, "& .MuiDrawer-paper": {  width: drawerWidth,  boxSizing: "border-box", }}}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {(userData?.user?.role === USER_ROLE.ADMIN ? sideBarRoutes : isNotAdminSideBarRoutes ).map((route) => (
            <ListItem key={route.to} disablePadding value={route.name}>
              <Tooltip title={route.name} placement="right">
                <ListItemButton
                  sx={{ minHeight: 48, justifyContent: open ? "initial" : "center", alignItems: "center", mx: 1, my: 0.5, borderRadius: 1, bgcolor: route.to === pathname ? "primary.main" : "transparent", color: route.to === pathname ? "primary.contrastText" : "inherit", }} 
                  onClick={() => {
                    router.push(route.to)
                    handleDrawerClose()
                  }}
                >
                  <ListItemIcon
                    sx={{ minWidth: 0, mr: open ? 3 : "auto", justifyContent: "center", }} >
                    <route.Icon />
                  </ListItemIcon>
                  <ListItemText primary={route.name} sx={{ opacity: open ? 1 : 0}}/>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Main open={open} sx={{ flexGrow: 1, px: 1, overflowX: "hidden", overflowY: "auto", maxHeight: `calc(100vh - ${drawerWidth}px)` }}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  );
}
