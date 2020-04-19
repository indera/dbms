import React from "react";
import { AppUser } from "../../App";
import { Layout } from "antd";
import QueryMenu from "./QueryMenu";
import DataSummary from "./DataSummary";

const { Sider, Content } = Layout;

interface DataPageState {
  selectedQuery: number;
}

interface DataPageProps {
  loginAppUser: (user: AppUser) => void;
}

interface Queries {
  [key: number]: String;
}

const queries: Queries = {
  0: "Total number of records",
  1: "1. ", // TODO: add description
  2: "2. ", // TODO: add description
  3: "3. ", // TODO: add description
  4: "4. ", // TODO: add description
  5: "5. ", // TODO: add description
  6: "6. ", // TODO: add description
};

class DataPage extends React.Component<DataPageProps, DataPageState> {
  public state: Readonly<DataPageState> = {
    selectedQuery: 0,
  };

  public clickMenu = (evt: { key: number }) => {
    window.console.log("clickMenu: ", evt.key);
    this.setState({ selectedQuery: evt.key });
  };

  public getDataComponent = () => {
    const { selectedQuery } = this.state;
    window.console.log("getDataComponent: ", selectedQuery);

    if (0 === selectedQuery) {
      return <DataSummary />;
    }
    // if (1 === selectedQuery) {
    //   return <DataQ1 />;
    // }
    // if (2 === selectedQuery) {
    //   return <DataQ2 />;
    // }
    // if (3 === selectedQuery) {
    //   return <DataQ3 />;
    // }
    // if (4 === selectedQuery) {
    //   return <DataQ4 />;
    // }
    // if (5 === selectedQuery) {
    //   return <DataQ5 />;
    // }
    // if (6 === selectedQuery) {
    //   return <DataQ6 />;
    // }
    return null;
  };

  public render() {
    const { selectedQuery } = this.state;
    const description = queries[selectedQuery];

    return (
      <Layout>
        <Content>
          <Sider width={200} className="site-layout-background">
            <QueryMenu clickHandler={this.clickMenu} />
          </Sider>
        </Content>

        <Content>
          <h2> Displaying data: {description}</h2>
          {this.getDataComponent()}
        </Content>
      </Layout>
    );
  }
}

export default DataPage;
