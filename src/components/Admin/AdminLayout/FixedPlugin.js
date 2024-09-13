import React from "react";
import { Dropdown } from "react-bootstrap";
import sideBarImage1 from "../../../adminAssets/img/sidebar-1.jpg";
import sideBarImage2 from "../../../adminAssets/img/sidebar-2.jpg";
import sideBarImage3 from "../../../adminAssets/img/sidebar-3.jpg";
import sideBarImage4 from "../../../adminAssets/img/sidebar-4.jpg";

function FixedPlugin({ color, setColor, image, setImage }) {
  return (
    <div className="fixed-plugin">
      <Dropdown>
        <Dropdown.Toggle
          id="dropdown-fixed-plugin"
          variant=""
          className="text-white border-0 opacity-100"
        >
          <i className="fas fa-cogs fa-2x mt-1"></i>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <li className="header-title">Sidebar Images</li>
          {[sideBarImage1, sideBarImage2, sideBarImage3, sideBarImage4].map((img, index) => (
            <li key={index} className={image === img ? "active" : ""}>
              <a
                className="img-holder switch-trigger d-block"
                href="#pablo"
                onClick={(e) => {
                  e.preventDefault();
                  setImage(img);
                }}
              >
                <img alt="..." src={img}></img>
              </a>
            </li>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default FixedPlugin;
