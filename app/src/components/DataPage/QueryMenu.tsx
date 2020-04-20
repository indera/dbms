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
        style={{ width: 320 }}
        defaultSelectedKeys={["0"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
      >
        <SubMenu
          key="sub1"
          title={
            <span>
              <AppstoreOutlined />
              <span>List of visualisations</span>
            </span>
          }
        >
          <Menu.Item key="0"> Number of records in tables</Menu.Item>
          <Menu.Item key="1">1: Sum Transaction Balance by Gender</Menu.Item>
          <Menu.Item key="2">2: Number of Cards Issues </Menu.Item>
          <Menu.Item key="3">3: Loan Stats for Age Groups</Menu.Item>
          <Menu.Item key="4">4: Accounts Open by Disposition</Menu.Item>
          <Menu.Item key="5">5: Transaction Trends</Menu.Item>
          <Menu.Item key="6">6: Sum Loan Amount by District</Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default QueryMenu;
