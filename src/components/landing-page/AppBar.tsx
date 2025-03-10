'use client';
/* eslint-disable @next/next/no-img-element */
import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Image from 'next/image';
import { langFormat } from '@/utils/langFormat';
import { useRouter } from 'next/navigation';
import { paths } from '@/constants/paths';
import BgColorSwitch from '../bg-color-switch';

const logoStyle = {
  width: '140px',
  height: 'auto',
  cursor: 'pointer',
};


function AppAppBar() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };


  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

 const handleGoLogin = () => {
   router.push(paths.login)
 }

 const handleGoRegister = () => {
   router.push(paths.signup)
 }

  return (
      <AppBar
        position="fixed"
        sx={{ boxShadow: 0, bgcolor: 'transparent', backgroundImage: 'none', mt: 2, }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, borderRadius: '999px', bgcolor: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(24px)', maxHeight: 40, border: '1px solid', borderColor: 'divider', boxShadow: theme.palette.mode === 'light' ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)` : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',  })}
          >
            <Box
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: '-18px', px: 0, gap: '10px' }}
            >
              <Box sx={{ width: '140px', height: '40px', cursor: 'pointer', overflow: 'hidden', position: 'relative', borderRadius: '30px' }}>
                <Image style={{ position: 'absolute', transform: 'translate(-50%, -50%)', top: '50%', left: '50%' }} src="/logo.png" width={140} height={100}  alt="logo" blurDataURL='/logo.png' />
              </Box>
              <Box sx={{ display: { xs: 'none', md: 'flex', gap: '5px' } }}>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px',  borderRadius: '20px' }}
                >
                  <Typography variant="body2" color="text.primary"> {langFormat({ uz: 'Xizmatlar', ru: 'Услуги', en: 'Features' })} </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('testimonials')}
                  sx={{ py: '6px', px: '12px',  borderRadius: '20px' }}
                >
                  <Typography variant="body2" color="text.primary"> {langFormat({ uz: 'Fikrlar', ru: 'Отзывы', en: 'Testimonials' })} </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('highlights')}
                  sx={{ py: '6px', px: '12px',  borderRadius: '20px' }}
                >
                  <Typography variant="body2" color="text.primary"> {langFormat({ uz: 'Qo\'shimcha', ru: 'Дополнительно', en: 'Highlights' })} </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('faq')}
                  sx={{ py: '6px', px: '12px',  borderRadius: '20px' }}
                >
                  <Typography variant="body2" color="text.primary"> {langFormat({ uz: 'FAQ', ru: 'FAQ', en: 'FAQ' })} </Typography>
                </MenuItem>
              </Box>
            </Box>
            <Box
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center', }} >
                <BgColorSwitch checked={localStorage.getItem("themeMode") === "dark"} onChange={() => {
                  const themeMode = localStorage.getItem("themeMode");
                  if (themeMode === "dark") {
                    localStorage.setItem("themeMode", "light");
                  } else {
                    localStorage.setItem("themeMode", "dark");
                  }
                  window.location.reload();
                }}/>
              <Button onClick={handleGoLogin} color="primary" variant="text" size="small"  >
                {langFormat({ uz: 'Kirish', ru: 'Вход', en: 'Sign in' })}
              </Button>
              <Button onClick={handleGoRegister} color="primary" variant="contained" size="small"  >
               {langFormat({ uz: 'Ro\'yxatdan o\'tish', ru: 'Регистрация', en: 'Sign up' })}
              </Button>
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button variant="text" color="primary" aria-label="menu" onClick={toggleDrawer(true)} sx={{ minWidth: '30px', p: '4px' }} >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{ minWidth: '60dvw', p: 2, backgroundColor: 'background.paper', flexGrow: 1, }}
                >
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', flexGrow: 1, }}
                  >
                  </Box>
                  <MenuItem onClick={() => scrollToSection('features')}>
                    {langFormat({ uz: 'Xizmatlar', ru: 'Услуги', en: 'Features' })}
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('testimonials')}>
                    {langFormat({ uz: 'Fikrlar', ru: 'Отзывы', en: 'Testimonials' })}
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('highlights')}>
                    {langFormat({ uz: 'Qo\'shimcha', ru: 'Дополнительно', en: 'Highlights' })}
                  </MenuItem>
                  <MenuItem onClick={() => scrollToSection('faq')}>{langFormat({ uz: 'FAQ', ru: 'FAQ', en: 'FAQ' })}</MenuItem>
                  <Divider />
                  
                  <MenuItem>
                    <Button onClick={handleGoLogin} color="primary" variant="contained" sx={{ width: '100%' }} >
                      {langFormat({ uz: 'Ro\'yxatdan o\'tish', ru: 'Регистрация', en: 'Sign up' })}
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={handleGoRegister} color="primary" variant="outlined"  sx={{ width: '100%' }} >
                      {langFormat({ uz: 'Kirish', ru: 'Вход', en: 'Sign in' })}
                    </Button>
                  </MenuItem>
                  <BgColorSwitch checked={localStorage.getItem("themeMode") === "dark"} onChange={() => {
                    const themeMode = localStorage.getItem("themeMode");
                    if (themeMode === "dark") {
                      localStorage.setItem("themeMode", "light");
                    } else {
                      localStorage.setItem("themeMode", "dark");
                    }
                    window.location.reload();
                    }}/>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
  );
}

export default AppAppBar;