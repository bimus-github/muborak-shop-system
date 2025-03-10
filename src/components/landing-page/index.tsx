'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import AppBar from './AppBar';
import Hero from './Hero';
import Features from './Features';

export default function LandingPage() {

  return (
    <>
      <AppBar />
      <Hero />
      <Box>
        <Features />
        {/* <Divider /> */}
        {/* <Testimonials /> */}
        {/* <Divider /> */}
        {/* <Highlights /> */}
        {/* <Divider /> */}
        {/* <Pricing /> */}
        {/* <Divider /> */}
        {/* <FAQ /> */}
        {/* <Divider /> */}
        {/* <Footer />  */}
      </Box>
    </>
  );
}