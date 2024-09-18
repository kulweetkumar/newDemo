import React from 'react';
import { Route, Routes } from "react-router-dom";
import AdminNavbar from "../AdminLayout/AdminNavbar";
import Footer from "../AdminLayout/Footer";
import Sidebar from "../AdminLayout/Sidebar";
// import FixedPlugin from "../AdminLayout/FixedPlugin.js";
import routes from "../../../sideBar";
import sidebarImage from "../../../adminAssets/img/sidebar-3.jpg";

function Admin() {
  // const [image, setImage] = React.useState(sidebarImage);
  // const [color, setColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const mainPanel = React.useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      const Component = prop.component;
      
      return (
        prop.layout === "/admin" && Component ? (
          <Route
            path={prop.layout + prop.path}
            element={<Component />} 
            key={key}
          />
         
        ) : null
      );
    });
  };
  return (
    <>
      <div className="wrapper">
        {/* <Sidebar color={color} image={hasImage ? image : ""} routes={routes} /> */}
        <Sidebar color="black" image={sidebarImage} routes={routes} />

        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Routes>{getRoutes(routes)}</Routes> {/* Renders dynamic routes */}
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default Admin;
