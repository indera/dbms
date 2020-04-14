# Professor feedback

1. I do not understand your use of the term "in time". Do you mean "over time"? This query seems to be a trend query. But I do not see the logical connection between "remaining account balances" and "getting a loan". Dimitrios, please explain.
2. I have the impression that this query has a similar structure like Query 1. Therefore, it does not qualify.
3. This is an interesting query but no trend query. You deal with absolute values here presented in a bar chart.
4. This is similar to the previous query.
5. A heat map is interesting but not a trend query in our sense.
6. I am not sure whether the answer to this query leads to a line graph since I do not see a continuous evolution. It is more a bar chart with a bar for each selected time unit. But it is a trend query.
7. This is not a trend query.
8. A histogram here shows the amount of loans for each kind of loan. But all numbers are absolute and do not show a trend in the sense of our project. You could talk about an "absolute trend" here that actually represents a ranking.
9. A pie chart does not represent a trend in the sense of our project but rather a ranking.
10. A heat map is interesting but not a trend query in our sense.


# Initial queries

1. Plot the remaining account balance of the clients in time. We will project 2 lines on this graph color-coded for males and females. We will use filters to look for specific ages in this line graph. This can provide useful information to the user, since they can observe the trend of the clients’ remaining amounts, in case they ask the bank for a loan.
2. Plot the transaction amount in time. We will project 2 lines on this graph color-coded for credit transactions and withdrawals. It is important for a banker to know if their client is spending more and more money over time, or if they are trying to cut back. We can also filter the information in this line graph.
3. Plot the number of each type of card issued per year over all the available years in the data set. In this bar chart we can place filters on the years we are interested in. The importance of this graph lies within the fact that some cards are premium, and the bank might be lending more money to some clients by giving them a higher credit limit.
4. Plot the number of people of each loan status over the available years in the data set. In this bar chart we can place filters on the amount of the loan that was taken and the time period the user wants to look at. This query is useful since the user can see how many loans are active/inactive and which ones have been paid/not paid.
5. Heatmap of the inhabitants on the various districts. This could be beneficial to the bank in order to decide where its next physical store should be.
6. Plot the creation of entrepreneur accounts over time using time filters. This is a line graph that can be used by the bank to identify if in a specific amount of time it has attracted more entrepreneurs.
7. Create a bar chart of the various statement frequencies. This is useful in order for the bank to find out when its clients prefer to receive their statements.
8. Create a histogram of the amounts for each type of loan status and color-code the number of loans in each amount. We will create filters in order for the user to see only the amounts they are interested in.
9. Create a pie chart with the transaction characterization for the Transaction table, such as insurance payment, statement payment, interest credited, sanction interest if negative balance, household payment, pension and loan payment. With this graph the bank will know which payments are most common and which ones are more rare in order to adjust its fees accordingly.
10. Heatmap of the transactions. This can be very useful if the bank is considering targeting certain parts of the country with mail offers.


1. Dimitrios 
```sql
SELECT
    SUM(balance)
FROM TRANSACTION
    Client -> Disposit -> Transaction
group by month gender
```

2. not good

3. Andrei - Display two lines for credit cards
select TO_CHAR(issued, 'YYYY-MM'), count(*) from dmelisso.card group by TO_CHAR(issued, 'YYYY-MM') order by 1;
   cards -> disposition -> client -> birth 
 - cumulative - stack overflow https://data.stackexchange.com/stackoverflow/query/81416/cumulative-sum-with-group-by
 - diff in number of cards added: https://stackoverflow.com/questions/15762585/mysql-query-to-get-trend-of-temperature

4. Andrei - Loan -> Disposition -> Client.birth_number

```
SELECT
    L.STATUS
    , TO_CHAR(START_DATE, 'YYYY-MM') AS theMonth
    , COUNT(*)
FROM
    dmelisso.LOAN L
    JOIN dmelisso.DISPOSITION D ON D.account_id = L.account_id
    JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
WHERE
    TO_DATE('1999-01-01', 'YYYY-MM-DD') - BIRTH_NUMBER > 40 -- this needs to be fixed
GROUP BY
    L.STATUS
    , TO_CHAR(START_DATE, 'YYYY-MM')
ORDER BY
    L.STATUS,
    TO_CHAR(START_DATE, 'YYYY-MM')
;
```

5. not good

6. Forget about it since we don't have enterpreneurs in time

7. Srija # of accounts groupped by create_month and age group

8. Mukul 
    - count of transactions 
    - sum trans_amount
    - group by month and district 
    - filter by district_detail


9. Shangde
    - one query

