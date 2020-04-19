import React from "react";
import "./AppFooter.css";
import { Menu } from "antd";

const AppFooter: React.StatelessComponent = () => {
  return (
    <Menu theme="dark" mode="horizontal">
      <Menu.Item>
        Database Management Systems - Spring 2020 - University of Florida
      </Menu.Item>
    </Menu>
  );
};

export default AppFooter;
