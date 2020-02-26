
-- this file is for MySQL (does not work for Oracle)
CREATE TABLE account (
    account_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    district_id bigint(20) unsigned NOT NULL,
    frequency char(2) NOT NULL,
    created_date date NOT NULL DEFAULT '0000-00-00',
PRIMARY KEY (account_id),
KEY `district` (district_id),
KEY `created_frequency` (created_date, frequency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE card (
    card_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    disp_id bigint(20) unsigned NOT NULL,
    card_type char(2) NOT NULL,
    issued_date date NOT NULL DEFAULT '0000-00-00',
PRIMARY KEY (card_id),
KEY `disp_id` (disp_id),
KEY `issued_type` (issued_date, card_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE client (
    client_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    district_id bigint(20) unsigned NOT NULL,
    birth_date date NOT NULL DEFAULT '0000-00-00',
    gender char(1) NOT NULL,
PRIMARY KEY (client_id),
KEY `district` (district_id),
KEY `birth_gender` (birth_date, gender)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE disposition (
    disp_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    client_id bigint(20) unsigned NOT NULL,
    account_id bigint(20) unsigned NOT NULL,
    disp_type char(1) NOT NULL,
PRIMARY KEY (disp_id),
KEY `client` (client_id),
KEY `account` (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- https://www.draw.io/#G1_l03368IH17grcnq7wuqdmr-PtJPH85g
-- https://en.wikipedia.org/wiki/Districts_of_the_Czech_Republic
-- https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_sql.html
CREATE TABLE district(
    district_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    region_id bigint(20) unsigned NOT NULL,
    district_name varchar(64) NOT NULL,
PRIMARY KEY (district_id),
KEY `region` (region_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*
df_loan.groupby('status').agg(['count']);
       loan_id account_id  date amount duration payments
         count      count count  count    count    count
status
A          203        203   203    203      203      203
B           31         31    31     31       31       31
C          403        403   403    403      403      403
D           45         45    45     45       45       45
*/

CREATE TABLE loan (
    loan_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    account_id bigint(20) unsigned NOT NULL,
    loan_date date NOT NULL DEFAULT '0000-00-00',
    duration int(11) unsigned NOT NULL,
    payments decimal(10,2) unsigned NOT NULL,
    status char(1) NOT NULL,
PRIMARY KEY (loan_id),
KEY `account_date` (account_id, loan_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/*

Category:
df_order.groupby('k_symbol').agg(['count']);
         order_id account_id bank_to account_to amount
            count      count   count      count  count
k_symbol
             1379       1379    1379       1379   1379
LEASING       341        341     341        341    341
POJISTNE      532        532     532        532    532
SIPO         3502       3502    3502       3502   3502
UVER          717        717     717        717    717
*/

CREATE TABLE account_order (
    order_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    account_id bigint(20) unsigned NOT NULL,
    bank_to char(2) NOT NULL,
    account_to bigint(20) unsigned NOT NULL,
    amount decimal(10,2) unsigned NOT NULL,
    category char(3) NOT NULL DEFAULT 'N/A',
PRIMARY KEY (order_id),
KEY `account_id` (account_id),
KEY `account_to` (account_to),
KEY `category` (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/* 
>>> df_trans['amount'].min()
0.0
>>> df_trans['amount'].max()
87400.0

df_trans['balance'].min()
-41125.7
>>> df_trans['balance'].max()
209637.0

Operation:
    PREVOD NA UCET   208283 - remittance to another bank (REM)
    PREVOD Z UCTU     65226 - collection from another bank (COL)
    VKLAD            156743 - credit in cash (CRE)
    VYBER            434918 - withdrawal in cash (WCA)
    VYBER KARTOU       8036 - credit card withdrawal (WCC)

Category:
    DUCHOD         30338 - old-age pension
    POJISTNE       18500 - insurance payment
    SANKC. UROK     1577 - sanction interest if negative balance 
    SIPO          118065 - household
    SLUZBY        155832 - payment for statement 
    UROK          183114 - interest credited 
    UVER           13580 -  loan payment

*/

CREATE TABLE transaction (
    trans_id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
    account_id bigint(20) unsigned NOT NULL,
    created_date date NOT NULL DEFAULT '0000-00-00',
    trans_type char(2) NOT NULL, -- CR+=credit, DB=-debit
    operation char(3) NOT NULL,
    amount decimal(10,2) unsigned NOT NULL,
    balance decimal(10,2)  NOT NULL,
    category char(3) NOT NULL DEFAULT 'N/A',
    bank_to char(2) NOT NULL,
    account_to bigint(20) unsigned NOT NULL,
PRIMARY KEY (trans_id),
KEY `account_id` (account_id),
KEY `created_type` (created_date, trans_type),
KEY `operation` (operation),
KEY `amount` (amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




