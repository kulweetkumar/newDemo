import React from 'react';
import { Route, Routes } from "react-router-dom";
import AdminNavbar from "../AdminLayout/AdminNavbar";
import Footer from "../AdminLayout/Footer";
import Sidebar from "../AdminLayout/Sidebar";
import FixedPlugin from "../AdminLayout/FixedPlugin.js";
import routes from "../../../route.js";
import sidebarImage from "../../../adminAssets/img/sidebar-3.jpg";

function Admin() {
  const [image, setImage] = React.useState(sidebarImage);
  const [color, setColor] = React.useState("black");
  const [hasImage, setHasImage] = React.useState(true);
  const mainPanel = React.useRef(null);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      // Ensure the component is a valid React component
      const Component = prop.component;
      return (
        prop.layout === "/admin" && Component ? (
          <Route
            path={prop.layout + prop.path}
            element={<Component />} // Use `element` prop to render the component
            key={key}
          />
        ) : null
      );
    });
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
          <AdminNavbar />
          <div className="content">
            <Routes>{getRoutes(routes)}</Routes> {/* Renders dynamic routes */}
          </div>
          <Footer />
        </div>
      </div>
      <FixedPlugin
        hasImage={hasImage}
        setHasImage={() => setHasImage(!hasImage)}
        color={color}
        setColor={(color) => setColor(color)}
        image={image}
        setImage={(image) => setImage(image)}
      />
    </>
  );
}

export default Admin;
