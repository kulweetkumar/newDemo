
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Home from "./components/pages/home"
import About from "./components/pages/about_us"
import Contact from "./components/pages/contact_us"
import PrivacyPolicy from "./components/pages/privacy_policy"
import TermCondition from "./components/pages/term_condition"

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact-us' element={<Contact />} />
          <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          <Route path='/term-condition' element={<TermCondition />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
