
-- 1993-07-05 00:00:00	1998-12-08 00:00:00
select min(START_DATE), MAX(START_DATE) FROM dmelisso.loan;


-- example generating all months in date range
WITH t as (
    SELECT date '1993-07-05' init, date '1998-12-08' final
    FROM DUAL
)
select to_char(add_months(trunc(init, 'mm'), level - 1), 'RRRR-MM') dts
FROM
    t
    connect by level <= months_between(final, init) + 1
;


-- groups and months
SELECT * FROM
    (select 'g60' GR FROM DUAL UNION ALL SELECT 'g30-60' FROM DUAL UNION ALL SELECT 'g0-30' from dual) GRP
    CROSS JOIN
    (
                  WITH t as (
                      select date '1993-07-05' init, date '1998-12-08' final
                      from dual
                  )
                  select to_char(add_months(trunc(init, 'mm'), level - 1), 'RRRR-MM') dts
                  from t
                  connect by level <= months_between(final, init) + 1
    )
order by GRP.GR, dts
;

