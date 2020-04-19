import React, { Component } from "react";
import { Layout, Menu } from "antd";
import {
  DatabaseOutlined,
  // LaptopOutlined,
} from "@ant-design/icons";

import QueryMenu from "./components/DataPage/QueryMenu";
import AppFooter from "./components/AppFooter/AppFooter";

import "./App.css";
import { ClickParam } from "antd/lib/menu";
import AboutPage from "./components/AboutPage/AboutPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import DataPage from "./components/DataPage/DataPage";

const { Header, Footer, Sider, Content } = Layout;

type PageType = "about" | "login" | "logout" | "register" | "data";

export interface AppUser {
  email: string;
  password: string;
}

interface AppState {
  currentPage: PageType;
  loggedIn: boolean;
  loggedInUser: AppUser | null;
}

class App extends Component<{}, AppState> {
  public state: Readonly<AppState> = {
    currentPage: "login",
    loggedIn: false,
    loggedInUser: null,
  };

  public needsLogin = (page: PageType) => {
    // access to data requires login
    return ["data"].includes(page);
  };

  public loginAppUser = (user: AppUser) => {
    this.setState({ loggedIn: true, loggedInUser: user, currentPage: "data" });
  };

  public logoutAppUser = () => {
    this.setState({
      loggedIn: false,
      loggedInUser: null,
      currentPage: "about",
    });
  };

  public selectPage = (page: PageType) => (evt: ClickParam) => {
    const { currentPage, loggedIn } = this.state;
    window.console.log(`currentPage: ${currentPage}`);
    window.console.log(`selectPage: ${page}`);

    if (!loggedIn) {
      if (["data"].includes(page)) {
        window.console.log("Needs to be loggedin...");
        this.logoutAppUser();
      }
    }

    if (page === "logout") {
      this.logoutAppUser();
    } else {
      this.setState({ currentPage: page });
    }
  };

  public render() {
    const { loggedIn, loggedInUser, currentPage } = this.state;

    const appMenu = () => {
      return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" onClick={this.selectPage("about")}>
            <>
              <DatabaseOutlined twoToneColor="#eb2f96" />
              About
            </>
          </Menu.Item>

          {!loggedIn && (
            <Menu.Item key="2" onClick={this.selectPage("register")}>
              Register
            </Menu.Item>
          )}

          {!loggedIn && (
            <Menu.Item key="3" onClick={this.selectPage("login")}>
              Login
            </Menu.Item>
          )}

          {loggedIn && (
            <Menu.Item key="4" onClick={this.selectPage("data")}>
              Data Visualisation
            </Menu.Item>
          )}
          {loggedIn && (
            <Menu.Item key="5" onClick={this.selectPage("logout")}>
              Logout
            </Menu.Item>
          )}
        </Menu>
      );
    };

    return (
      <Layout style={{ height: "100vh", overflow: "auto" }}>
        <Header className="header">{appMenu()}</Header>

        <Content style={{ padding: "15px 50px" }}>
          {/* {loggedIn && currentPage === "data" && (
              <Sider width={200} className="site-layout-background">
                <QueryMenu />
              </Sider>
            )} */}

          <Layout>
            <Content>
              {currentPage === "about" && (
                <AboutPage loggedInUser={loggedInUser} />
              )}

              {!loggedIn && currentPage === "register" && <RegisterPage />}

              {!loggedIn && currentPage === "login" && (
                <LoginPage loginAppUser={this.loginAppUser} />
              )}

              {loggedIn && currentPage === "data" && (
                <DataPage loginAppUser={this.loginAppUser} />
              )}
            </Content>
          </Layout>
        </Content>

        <Footer style={{ position: "sticky", bottom: "0" }}>
          <AppFooter />
        </Footer>
      </Layout>
    );
  }
}

export default App;
