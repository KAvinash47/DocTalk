import React, { Suspense } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import Loader from '../Loader';

const MainLayout = () => {
  const navigation = useNavigation();

  return (
    <>
      <Navbar />
      {navigation.state === 'loading' && <Loader />}
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};

export default MainLayout;
