
-- render two lines: M/F
SELECT
    c.gender,
    SUM(t.balance) AS SUM_of_balance,
    TO_CHAR(t.created_DATE, 'YYYY-MM') AS Month
FROM
    dmelisso.client c
    JOIN dmelisso.disposition d ON c.client_id = d.client_id
    JOIN dmelisso.transactions t ON t.account_id = d.account_id
GROUP BY
    gender,
    TO_CHAR(created_DATE, 'YYYY-MM')
ORDER BY
    gender,
    TO_CHAR(created_DATE, 'YYYY-MM');
