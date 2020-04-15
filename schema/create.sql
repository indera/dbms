
-- select * from USER_TABLESPACES;

CREATE TABLE region(
    region_id number NOT NULL,
    region_name varchar(100) NOT NULL,
    region_capital varchar(100) NOT NULL,
    region_area float NOT NULL,
    region_population number NOT NULL,
    region_gdp float NOT NULL,
    region_website varchar(100),
    latitude number,
    longitute number,
PRIMARY KEY (region_id) 
);

CREATE TABLE district(
    district_id number NOT NULL,
    region_id number NOT NULL,
    district_name varchar(64) NOT NULL,
PRIMARY KEY (district_id),
FOREIGN KEY(region_id) REFERENCES region (region_id) INITIALLY DEFERRED DEFERRABLE
);

CREATE TABLE district_detail(
    district_id number NOT NULL,
    cities number NOT NULL,
    salary_average float NOT NULL,
    ratio_urban float NOT NULL,
    ratio_entrepreneurs float NOT NULL,
UNIQUE (district_id),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
);

CREATE TABLE district_population(
    district_id number NOT NULL,
    inhabitants number NOT NULL,
    municipalities_500 number NOT NULL,
    municipalities_2k number NOT NULL,
    municipalities_10k number NOT NULL,
    municipalities_10k_above number NOT NULL,
UNIQUE (district_id),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
);

CREATE TABLE district_history(
    district_id number NOT NULL,
    year number NOT NULL,
    crimes number,
    ratio_unemployment number,
UNIQUE (district_id, year),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
);

CREATE TABLE account (
    account_id number NOT NULL,
    district_id number NOT NULL,
    frequency char(2) NOT NULL,
    created_date date NOT NULL,
PRIMARY KEY (account_id),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
);


CREATE TABLE account_order (
    order_id number NOT NULL,
    account_id number NOT NULL,
    bank_to char(2) NOT NULL,
    account_to number NOT NULL,
    amount decimal(10,2) NOT NULL,
    category char(3) NOT NULL,
PRIMARY KEY (order_id),
FOREIGN KEY(account_id) REFERENCES account (account_id) INITIALLY DEFERRED DEFERRABLE,
FOREIGN KEY(account_to) REFERENCES account (account_id) INITIALLY DEFERRED DEFERRABLE
);


CREATE TABLE transaction (
    trans_id number NOT NULL,
    account_id number NOT NULL,
    created_date date NOT NULL,
    trans_type char(2) NOT NULL, -- CR+=credit, DB=-debit
    operation char(3) NOT NULL,
    amount decimal(10,2) NOT NULL,
    balance decimal(10,2) NOT NULL,
    category char(3) NOT NULL,
    bank_to char(2),
    account_to number,
PRIMARY KEY (trans_id),
FOREIGN KEY(account_id) REFERENCES account (account_id) INITIALLY DEFERRED DEFERRABLE
);


CREATE TABLE client (
    client_id number NOT NULL,
    district_id number NOT NULL,
    birth_date date NOT NULL,
    gender char(1) NOT NULL,
PRIMARY KEY (client_id),
FOREIGN KEY(district_id) REFERENCES district (district_id) INITIALLY DEFERRED DEFERRABLE
);

CREATE TABLE disposition (
    disp_id number NOT NULL,
    client_id number NOT NULL,
    account_id number NOT NULL,
    disp_type char(1) NOT NULL,
PRIMARY KEY (disp_id),
FOREIGN KEY(client_id) REFERENCES client (client_id) INITIALLY DEFERRED DEFERRABLE,
FOREIGN KEY(account_id) REFERENCES account (account_id) INITIALLY DEFERRED DEFERRABLE
);


CREATE TABLE card (
    card_id number NOT NULL,
    disp_id number NOT NULL,
    card_type char(2) NOT NULL,
    issued_date date NOT NULL,
PRIMARY KEY (card_id),
FOREIGN KEY(disp_id) REFERENCES disposition (disp_id) INITIALLY DEFERRED DEFERRABLE
);


CREATE TABLE loan (
    loan_id    number         NOT NULL,
    account_id number         NOT NULL,
    loan_date  date           NOT NULL,
    amount    decimal(10, 2) NOT NULL,
    duration   number,
    payments   decimal(10, 2) NOT NULL,
    status     char(1)        NOT NULL,
PRIMARY KEY (loan_id),
FOREIGN KEY(account_id) REFERENCES account (account_id) INITIALLY DEFERRED DEFERRABLE
);
