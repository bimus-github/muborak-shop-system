'use client';
import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { langFormat } from '@/utils/langFormat';

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({ width: '100%', backgroundImage: theme.palette.mode === 'light' ? 'linear-gradient(180deg, #CEE5FD, #FFF)' : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`, backgroundSize: '100% 20%',
        backgroundRepeat: 'no-repeat', })}
    >
      <Container
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: { xs: 14, sm: 20 }, pb: { xs: 8, sm: 12 }, }}
      >
        <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
          <Typography
            variant="h1"
            sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignSelf: 'center', textAlign: 'center', fontSize: 'clamp(3.5rem, 10vw, 4rem)', }}
          >
            {langFormat({ en: 'Streamline Your Business with Our Shop Manegement App', uz: "Do'konni boshqarish ilovamiz yordamida biznesingizni soddalashtiring", ru: "Оптимизируйте свой бизнес с помощью нашего приложения для управления магазином" })}
          </Typography>
          <Typography textAlign="center" color="text.secondary" sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
          >
            {langFormat({uz: "Inventarizatsiya, savdo va mijozlarni hammasini bir joyda boshqaring. Bizning intuitiv POS ilovamiz biznesingizni boshqarishni osonlashtiradi.", en: "Manage your inventory, sales, and customers all in one place. Our intuitive POS app makes running your business a breeze.", ru: 'Manage your inventory, sales, and customers all in one place. Our intuitive POS app makes running your business a breeze.'})}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignSelf="center" spacing={1} useFlexGap sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
            <TextField id="outlined-basic" hiddenLabel size="small" variant="outlined" aria-label="Enter your email address" placeholder={langFormat({uz: "Pochta manzilingiz", en: 'You email address', ru: 'Ваш адрес электронной почты'})} inputProps={{ autoComplete: 'off', 'aria-label': 'Enter your email address', }} />
            <Button variant="contained" color="primary">{langFormat({uz: 'Hoziroq Boshlang', en: 'Start Now', ru: 'Hачать сейчас'})}</Button>
          </Stack>
          <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
            {langFormat({uz: '“Hozir boshlash” tugmasini bosish orqali siz bizning Foydalanish shartlariga rozilik bildirasiz.', en: 'By clicking "Start now" you agree to our Terms & Conditions.', ru: 'Нажимая «Начать сейчас», вы соглашаетесь с нашими Условиями использования.'})}
          </Typography>
        </Stack>
        <Box
          id="image"
          sx={(theme) => ({
            mt: { xs: 8, sm: 10 },
            alignSelf: 'center',
            height: { xs: 200, sm: 700 },
            width: '100%',
            backgroundImage:
              theme.palette.mode === 'light'
                ? `url(${'/hero/statistics-white.png'})`
                : `url(${'/hero/statistics-black.png'})`,
            backgroundSize: 'cover',
            borderRadius: '10px',
            outline: '1px solid',
            outlineColor:
              theme.palette.mode === 'light'
                ? alpha('#BFCCD9', 0.5)
                : alpha('#9CCCFC', 0.1),
            boxShadow:
              theme.palette.mode === 'light'
                ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
          })}
        />
      </Container>
    </Box>
  );
}