import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import Home from "./components/pages/home";
import About from "./components/pages/about_us";
import Contact from "./components/pages/contact_us";
import PrivacyPolicy from "./components/pages/privacy_policy";
import TermCondition from "./components/pages/term_condition";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Login from './components/pages/login';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure you have Bootstrap CSS imported
import './App.css'; // Add your custom CSS here
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <div className="content-container">
          <div className="login-background">
          <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact-us' element={<Contact />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/term-condition' element={<TermCondition />} />
              <Route path='/login' element={<Login />} />
            </Routes>
          </div>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
