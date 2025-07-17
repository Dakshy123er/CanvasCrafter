// Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import Showcase from '../components/Showcase';
import Premium from '../components/Premium'

const Home = () => {
  return (
    <>
      {/* Hero Section with heading + animation + CTA */}
      <Hero />

      <Premium />

      {/* Showcase Section with Lottie + search + post cards */}
      <Showcase />
    </>
  );
};

export default Home;
