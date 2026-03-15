import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Blogs from "./Pages/Blogs";
import MyBookings from "./Pages/MyBookings";
import DoctorDetails from "./Pages/DoctorDetails";
import Error from "./Pages/Error";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="contact" element={<Contact />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="doctor/:id" element={<DoctorDetails />} />
        </Route>

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;