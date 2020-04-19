import { Menu } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import React from "react";

const { SubMenu } = Menu;

interface QueryMenuProps {
  clickHandler: (data: any) => void;
}

class QueryMenu extends React.Component<QueryMenuProps> {
  public render() {
    const { clickHandler } = this.props;

    return (
      <Menu
        onClick={clickHandler}
        style={{ width: 256 }}
        defaultSelectedKeys={["0"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <AppstoreOutlined />
              <span>List of queries</span>
            </span>
          }
        >
          <Menu.Item key="0">Total number of records</Menu.Item>
          <Menu.Item key="1">Query 1</Menu.Item>
          <Menu.Item key="2">Query 2</Menu.Item>
          <Menu.Item key="3">Query 3</Menu.Item>
          <Menu.Item key="4">Query 4</Menu.Item>
          <Menu.Item key="5">Query 5</Menu.Item>
          <Menu.Item key="6">Query 6</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default QueryMenu;
