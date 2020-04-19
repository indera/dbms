import React from "react";
import { AppUser } from "../../App";
import { Layout } from "antd";
import QueryMenu from "./QueryMenu";
import TableStats from "./TableStats";
import Trend2 from "./Trend2";

const { Sider, Content } = Layout;

interface DataPageState {
  selectedQuery: string;
}

interface DataPageProps {
  loginAppUser: (user: AppUser) => void;
}

class DataPage extends React.Component<DataPageProps, DataPageState> {
  public state: Readonly<DataPageState> = {
    selectedQuery: "0",
  };

  public getComponent = () => {
    const { selectedQuery } = this.state;

    if ("0" === selectedQuery) {
      return <TableStats />;
    }
    if ("1" == selectedQuery) {
      return <Trend1 />;
    }
    if ("2" === selectedQuery) {
      return <Trend2 />;
    }

    // if ("3" === selectedQuery) {
    //   return <Trend3 />;
    // }
    // if ("4" === selectedQuery) {
    //   return <Trend4 />;
    // }
    // if ("5" === selectedQuery) {
    //   return <Trend5 />;
    // }
    // if ("6" === selectedQuery) {
    //   return <Trend6 />;
    // }
    return null;
  };

  public clickMenu = (evt: { key: any }) => {
    // this.forceUpdate();
    window.console.log("clickMenu: ", evt.key);
    this.setState(
      {
        selectedQuery: evt.key,
      },
      () => {
        // window.console.log("after set state: ", this.state.selectedQuery);
      }
    );
  };

  public render() {
    return (
      <Layout>
        <Content>
          <Sider width={200} className="site-layout-background">
            <QueryMenu clickHandler={this.clickMenu} />
          </Sider>
        </Content>
        <Content>
          <div>{this.getComponent()}</div>
        </Content>
      </Layout>
    );
  }
}

export default DataPage;
