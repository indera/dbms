import React from "react";
import "./AboutPage.css";
import { AppUser } from "../../App";
import { Component } from "react";
import { Divider, List } from "antd";

// @see
// https://webpages.uncc.edu/mirsad/itcs6265/group1/index.html">
// https://ensquad.com/2018/06/21/the-berka-dataset-visualisation

interface AboutPageProps {
  loggedInUser: AppUser | null;
}

class AboutPage extends Component<AboutPageProps, {}> {
  public render() {
    const { loggedInUser } = this.props;

    const data: string[] = [
      "Shangde Gao - gao.shangde@ufl.edu",
      "Srija Gurijala - srijagurijala[at]ufl.edu",
      "Dimitrios Melissourgos - dmelissourgos[at]ufl.edu",
      "Andrei Sura - asura[at]ufl.edu",
      "Mukul Yadav - mchand.yadav[at]ufl.edu",
    ];

    return (
      <div className="about">
        {loggedInUser && <p>Welcome, {loggedInUser.email}!</p>}
        <p>
          The{" "}
          <a href="https://data.world/lpetrocelli/czech-financial-dataset-real-anonymized-transactions">
            Berka dataset
          </a>
          , from the{" "}
          <a href="http://lisp.vse.cz/pkdd99/">
            {" "}
            1999 PKDD Discovery Challenge{" "}
          </a>
          , provides information on the clients, accounts, and transactions of a
          Czech bank.
        </p>
        <p>
          The original task description of the Discovery
          <b> Challenge states: </b>
        </p>
        <p className="cite">
          The bank wants to improve their services. For instance, the bank
          managers have only vague idea, who is a good client (whom to offer
          some additional services) and who is a bad client (whom to watch
          carefully to minimize the bank loses).
        </p>
        <p className="cite">
          Fortunately, the bank stores data about their clients, the accounts
          (transactions within several months), the loans already granted, the
          credit cards issued. The bank managers hope to improve their
          understanding of customers and seek specific actions to improve
          services.
        </p>

        <Divider />
        <List
          size="small"
          header={<div>Members of team 25:</div>}
          bordered
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    );
  }
}

export default AboutPage;
