A) Cumulative cards issued in time


-- types of cards
select c.type, count(*) from dmelisso.card c group by c.type;

/**
classic	659
junior	145
gold	88
*/

-- Range of months
select min(issued), max(issued) from dmelisso.card;
-- 1993-11-07 00:00:00	1998-12-29 00:00:00


-- get every month in range
WITH t as (
    select date '1993-11-07' init, date '1998-12-29' final
    from dual
)
select to_char(add_months(trunc(init, 'mm'), level - 1), 'RRRR-MM') MONTH
from t
connect by level <= months_between(final, init) + 1
;

-- number of cards issued (maybe group by region ???)
SELECT
    TO_CHAR(issued, 'YYYY-MM')
     -- , AVG(INHABITANTS) AVG_IHABITANTS
    , count(*)
FROM
    dmelisso.CARD cr
    JOIN dmelisso.DISPOSITION d ON d.disp_id = cr.disp_id
    JOIN dmelisso.CLIENT c ON c.client_id = d.client_id
    -- JOIN dmelisso.DISTRICT_POPULATION dstr ON dstr.DISTRICT_ID = c.DISTRICT_ID
WHERE
    1999 - EXTRACT(YEAR FROM BIRTH_NUMBER) > 10
GROUP BY
    TO_CHAR(issued, 'YYYY-MM')
order by
1;



+----------+---------+-----------+------------+------------+
| Location | Product | Date      | Amount     |Running_Amt |
+----------+---------+-----------+------------+------------+
| A        | aa      | 1/1/2013  | 100        | 100        |
| A        | aa      | 1/5/2013  | -50        | 50         |
| A        | aa      | 5/1/2013  | 100        | 150        |
| A        | aa      | 8/1/2013  | 100        | 250        |
| A        | bb      | 1/1/2013  | 500        | 500        |
| A        | bb      | 1/5/2013  | -100       | 400        |
| A        | bb      | 5/1/2013  | -100       | 300        |
| A        | bb      | 8/1/2013  | 250        | 550        |
| C        | aa      | 3/1/2013  | 550        | 550        |
| C        | aa      | 5/5/2013  | -50        | 600        |
| C        | dd      | 10/3/2013 | 999        | 999        |
| C        | dd      | 12/2/2013 | 1          | 1000       |
+----------+---------+-----------+------------+------------+

select a.*, sum(Amount) over (partition by Location, Product order by Date) as Running_Amt
from Example_Table a


--=========================================================================

B) TODO trend in number of cards (892 small)



-- =====  Example showing trend
truncate table temperature_log;
select * from temperature_log;

CREATE TABLE temperature_log(
    ID INT NOT NULL,
    DT DATE NOT NULL,
    temperature DECIMAL(5,2) NOT NULL)
;

INSERT INTO temperature_log VALUES (50, TO_DATE('2013-03-27 07:56:05', 'YYYY/mm/dd hh24:mi:ss'), 27.25);
INSERT INTO temperature_log VALUES (51, TO_DATE('2013-03-27 07:57:05', 'YYYY/mm/dd hh24:mi:ss'), 27.50);
INSERT INTO temperature_log VALUES (52, TO_DATE('2013-03-27 07:58:05', 'YYYY/mm/dd hh24:mi:ss'), 27.60);
INSERT INTO temperature_log VALUES (53, TO_DATE('2013-03-27 07:59:05', 'YYYY/mm/dd hh24:mi:ss'), 27.80);
INSERT INTO temperature_log VALUES (54, TO_DATE('2013-03-27 08:00:05', 'YYYY/mm/dd hh24:mi:ss'), 27.70);
INSERT INTO temperature_log VALUES (55, TO_DATE('2013-03-27 08:01:05', 'YYYY/mm/dd hh24:mi:ss'), 27.50);
INSERT INTO temperature_log VALUES (56, TO_DATE('2013-03-27 08:02:05', 'YYYY/mm/dd hh24:mi:ss'), 27.25);
INSERT INTO temperature_log VALUES (57, TO_DATE('2013-03-27 08:03:05', 'YYYY/mm/dd hh24:mi:ss'), 27.10);
INSERT INTO temperature_log VALUES (58, TO_DATE('2013-03-27 08:04:05', 'YYYY/mm/dd hh24:mi:ss'), 26.9);
INSERT INTO temperature_log VALUES (59, TO_DATE('2013-03-27 08:05:05', 'YYYY/mm/dd hh24:mi:ss'), 27.1);
INSERT INTO temperature_log VALUES (60, TO_DATE('2013-03-27 08:06:05', 'YYYY/mm/dd hh24:mi:ss'), 27.25);
INSERT INTO temperature_log VALUES (61, TO_DATE('2013-03-27 08:07:05', 'YYYY/mm/dd hh24:mi:ss'), 27.6);


-- Show diff at every step
SELECT
    t1.id, t2.id
    , t1.dt
    , t1.temperature, t1.temperature - t2.temperature AS diff
    , CNT
FROM
(
    SELECT x.ID id1
         , MIN(y.ID) id2
         , count(distinct y.id) CNT
    FROM
        temperature_log x
        JOIN temperature_log y ON y.id < x.id
    GROUP BY x.id
    ORDER BY x.ID
) t0
JOIN temperature_log t1 ON t0.id1 = t1.id
JOIN temperature_log t2 ON t0.id2 = t2.ID
;

/*
id, id_old   DATE                       Change  Step
51	50	    2013-03-27 07:57:05	27.50	0.25	1
52	50	    2013-03-27 07:58:05	27.60	0.35	2
53	50	    2013-03-27 07:59:05	27.80	0.55	3
54	50	    2013-03-27 08:00:05	27.70	0.45	4
55	50	    2013-03-27 08:01:05	27.50	0.25	5
56	50	    2013-03-27 08:02:05	27.25	0	    6
57	50	    2013-03-27 08:03:05	27.10	-0.15	7
58	50	    2013-03-27 08:04:05	26.90	-0.35	8
59	50	    2013-03-27 08:05:05	27.10	-0.15	9
60	50	    2013-03-27 08:06:05	27.25	0	    10
61	50	    2013-03-27 08:07:05	27.60	0.35	11
*/
