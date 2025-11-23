import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackgroundEffects from '../components/BackgroundEffects';
import SmoothScroll from '../components/SmoothScroll';
import PageTransition from '../components/PageTransition';

const MainLayout = () => {
  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col relative">
        <BackgroundEffects />
        <div className="relative z-10">
          <Header />
          <main className="flex-grow pt-[120px] md:pt-[140px]">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
};

export default MainLayout;

