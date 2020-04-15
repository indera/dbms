-- https://stackoverflow.com/questions/1799128/oracle-if-table-exists
DROP TABLE account CASCADE CONSTRAINTS;
DROP TABLE account_order CASCADE CONSTRAINTS;
DROP TABLE card CASCADE CONSTRAINTS;
DROP TABLE client CASCADE CONSTRAINTS;
DROP TABLE disposition CASCADE CONSTRAINTS;
DROP TABLE district CASCADE CONSTRAINTS;
DROP TABLE district_detail;
DROP TABLE district_history;
DROP TABLE district_population;
DROP TABLE loan;
DROP TABLE region CASCADE CONSTRAINTS;
DROP TABLE transaction;


-- for login
DROP TABLE app_user;
