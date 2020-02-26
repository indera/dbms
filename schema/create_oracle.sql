
DROP TABLE account;
DROP TABLE account;

CREATE TABLE account (
    account_id number NOT NULL,
    district_id number NOT NULL,
    frequency char(2) NOT NULL,
    created_date date NOT NULL,
PRIMARY KEY (account_id)
) ;

CREATE INDEX district_id ON account(district_id);
CREATE INDEX created_date ON account(created_date);

