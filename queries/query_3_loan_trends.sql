-- (A) simple query: Loan status, month =>  number of loans

SELECT
    L.STATUS
    , TO_CHAR(START_DATE, 'YYYY-MM') AS theMonth
    , COUNT(*)
FROM
    dmelisso.LOAN L
    JOIN dmelisso.DISPOSITION D ON D.account_id = L.account_id
    JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
WHERE
    -- can filter by age at the time of data collection
    1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) > 10
GROUP BY
    L.STATUS
    , TO_CHAR(START_DATE, 'YYYY-MM')
ORDER BY
    L.STATUS,
    TO_CHAR(START_DATE, 'YYYY-MM')
;


-- (B) more complex: 3 age groups, each month in the interval of available data => AVG_PAYMENT, NUM_LOANS
-- Can add
--      AVG(AMOUNT)
--      AVG(DURATION)
SELECT X.*, Y.AVG_PAYMENTS, Y.NUM_LOANS FROM (
                  SELECT *
                  FROM (select 'g60' AGE_GROUP FROM DUAL
                        UNION ALL SELECT 'g30-60' FROM DUAL
                        UNION ALL SELECT 'g0-30' FROM DUAL
                      ) GRP
                    CROSS JOIN
                    (
                           WITH t as (
                               select date '1993-07-05' init, date '1998-12-08' final
                               from dual
                           )
                           select to_char(add_months(trunc(init, 'mm'), level - 1), 'RRRR-MM') MONTH
                           from t
                           connect by level <= months_between(final, init) + 1
                    )
                  ORDER BY GRP.AGE_GROUP, MONTH
              ) X
    LEFT JOIN
    (
        -- average payments for age groups
        SELECT CASE
                   WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 60 THEN 'g60'
                   WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 30 THEN 'g30-60'
                   ELSE 'g0-30'
            END                               AS AGE_GROUP
             , TO_CHAR(START_DATE, 'YYYY-MM') AS LOAN_CREATED_MONTH
             , AVG(PAYMENTS)                  AS AVG_PAYMENTS
             , COUNT(*)                       AS NUM_LOANS
             -- , AVG(AMOUNT)                    AS AVG_AMOUNT
             -- , AVG(DURATION) AS AVG_DURATION
        FROM dmelisso.LOAN L
                 JOIN dmelisso.DISPOSITION D ON D.account_id = L.account_id
                 JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
        WHERE
          -- can filter by age at the time of data collection
            1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) > 10
          AND D.TYPE = 'OWNER'
        GROUP BY CASE
                     WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 60 THEN 'g60'
                     WHEN 1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) >= 30 THEN 'g30-60'
                     ELSE 'g0-30'
            END
               , TO_CHAR(START_DATE, 'YYYY-MM')
        ORDER BY 1, 2
    ) Y ON Y.AGE_GROUP = X.AGE_GROUP AND Y.LOAN_CREATED_MONTH = X.MONTH
ORDER BY X.AGE_GROUP, X.MONTH
;

