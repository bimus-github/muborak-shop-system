'use client';
import * as React from 'react';
import { langFormat } from '@/utils/langFormat';
import { DevicesRounded, Money, ViewQuiltRounded } from '@mui/icons-material';
import { Box, Button, Card, Chip, Container, Grid, Stack, Typography } from '@mui/material';

const items = [
  {
    icon: <ViewQuiltRounded />,
    title: langFormat({ uz: 'Hisobotlar', en: "Statistics", ru: "Статистика" }),
    description: langFormat({
        uz: "Bu bo'lim sizga o'z biznesingizning hisobotlarini juda sodda va qulay usulda qo'lga kiritishingizga yordam beradi.",
        en: 'This section will help you get your business reports in a very simple and convenient way.',
        ru: 'Этот раздел поможет вам получить бизнес-отчеты очень простым и удобным способом.'
    }),
    imageLight: `url(${'/features/statistics-white.png'})`,
    imageDark: `url(${'/features/statistics-black.png'})`,
  },
  {
    icon: <Money />,
    title: langFormat({ uz: "Sotuv bo'limini tez va qulay ekanligi.", en: "Quick and easy sales management.", ru: "Быстрая и легкая управление продажами." }),
    description: langFormat({
        uz: "Bizning sotuv bo'limimiz orqali bir sotuvchi 10ta gacha bo'lgan mijozlarga ximat ko'rsata oladi. Agar paltforma internet tezliginidan kamchilik sezsa o'zi offline shakilga o'tib oladi va bu tezlikni tushib ketmasligini oldini oladi.",
        en: "One salesperson can serve up to 10 customers through our sales department. If the platform detects a lack of internet speed, it will automatically switch to offline mode and prevent the speed from dropping.",
        ru: 'Через наш отдел продаж один продавец может обслуживать до 10 клиентов. Если платформа обнаружит недостаточную скорость интернета, она автоматически перейдет в автономный режим и предотвратит падение скорости.'
    }),
    imageLight: 'url("/features/sale-white1.png"), url("/features/sale-white2.png")',
    imageDark: 'url("/features/sale-black1.png"), url("/features/sale-black2.png")',
  },
  {
    icon: <DevicesRounded />,
    title: langFormat({ uz: "Barch qurilmalarda ishlash qulayligi", en: "Efficiency in all platforms", ru: "Эффективность во всех платформах" }),
    description: langFormat({
        uz: "Har qanday qurilmalardan siz o'z biznesingizni kuzatishingiz mumkin.",
        en: "You can monitor your business from any device.",
        ru: "Вы можете отслеживать ваш бизнес с любого устройства."
    }),
    imageLight: 'url("/features/device-white1.png"), url("/features/device-white2.png")',
    imageDark: 'url("/features/device-black1.png"), url("/features/device-black2.png")',
  },
];

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index: number) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <div>
            <Typography component="h2" variant="h4" color="text.primary">
              {langFormat({ uz: "Platforma xizmatlari", ru: "Платформа услуг", en: "Platform services" })}
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: { xs: 2, sm: 4 } }}
            >
              {langFormat({ en: 'Here you will find the most basic services that we provide through our platform.', uz: "Bu yerda siz bizning platformamiz orqali taqdim etadigan eng asosiy xizmatlarni topasiz.", ru: 'Здесь вы найдете самые основные услуги, которые мы предоставляем через нашу платформу.' })}
            </Typography>
          </div>
          <Grid container item gap={1} sx={{ display: { xs: 'auto', sm: 'none' } }}>
            {items.map(({ title }, index) => (
              <Chip
                key={index}
                label={title}
                onClick={() => handleItemClick(index)}
                sx={{
                  borderColor: (theme) => {
                    if (theme.palette.mode === 'light') {
                      return selectedItemIndex === index ? 'primary.light' : '';
                    }
                    return selectedItemIndex === index ? 'primary.light' : '';
                  },
                  background: (theme) => {
                    if (theme.palette.mode === 'light') {
                      return selectedItemIndex === index ? 'none' : '';
                    }
                    return selectedItemIndex === index ? 'none' : '';
                  },
                  backgroundColor: selectedItemIndex === index ? 'primary.main' : '',
                  '& .MuiChip-label': {
                    color: selectedItemIndex === index ? '#fff' : '',
                  },
                }}
              />
            ))}
          </Grid>
          <Box
            component={Card}
            variant="outlined"
            sx={{
              display: { xs: 'auto', sm: 'none' },
              mt: 4,
            }}
          >
            <Box
              sx={{
                backgroundImage: (theme) =>
                  theme.palette.mode === 'light'
                    ? items[selectedItemIndex].imageLight
                    : items[selectedItemIndex].imageDark,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: 280,
              }}
            />
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography color="text.primary" variant="body2" fontWeight="bold">
                {selectedFeature.title}
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ my: 0.5 }}>
                {selectedFeature.description}
              </Typography>
            </Box>
          </Box>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={2}
            useFlexGap
            sx={{ width: '100%', display: { xs: 'none', sm: 'flex' } }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Card
                key={index}
                variant="outlined"
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={{
                  p: 3,
                  height: 'fit-content',
                  width: '100%',
                  background: 'none',
                  backgroundColor:
                    selectedItemIndex === index ? 'action.selected' : undefined,
                  borderColor: (theme) => {
                    if (theme.palette.mode === 'light') {
                      return selectedItemIndex === index
                        ? 'primary.light'
                        : 'grey.200';
                    }
                    return selectedItemIndex === index ? 'primary.dark' : 'grey.800';
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    textAlign: 'left',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: { md: 'center' },
                    gap: 2.5,
                  }}
                >
                  <Box
                    sx={{
                      color: (theme) => {
                        if (theme.palette.mode === 'light') {
                          return selectedItemIndex === index
                            ? 'primary.main'
                            : 'grey.300';
                        }
                        return selectedItemIndex === index
                          ? 'primary.main'
                          : 'grey.700';
                      },
                    }}
                  >
                    {icon}
                  </Box>
                  <Box sx={{ textTransform: 'none' }}>
                    <Typography
                      color="text.primary"
                      variant="body2"
                      fontWeight="bold"
                    >
                      {title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      sx={{ my: 0.5 }}
                    >
                      {description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: { xs: 'none', sm: 'flex' }, width: '100%' }}
        >
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              width: '100%',
              display: { xs: 'none', sm: 'flex' },
              pointerEvents: 'none',
            }}
          >
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'auto 45%, auto 45%',
                backgroundImage: (theme) =>
                  theme.palette.mode === 'light'
                    ? items[selectedItemIndex].imageLight
                    : items[selectedItemIndex].imageDark,
                    backgroundRepeat: 'no-repeat, no-repeat', 
                    backgroundPosition: 'center top, center bottom', 
              }}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}