import React, { Suspense, useEffect } from 'react';
import { Outlet, useNavigation, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Loader from '../Loader';
import CustomCursor from '../CustomCursor';
import MobileNavbar from '../MobileNavbar';

const MainLayout = () => {
  const navigation = useNavigation();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="page-transition flex flex-col min-h-screen relative">
      <CustomCursor />
      <Navbar />
      {navigation.state === 'loading' && <Loader />}
      <main className="flex-grow pb-24 md:pb-0 page-fade">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileNavbar />
    </div>
  );
};

export default MainLayout;
