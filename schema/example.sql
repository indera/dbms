-- https://stackoverflow.com/questions/15762585/mysql-query-to-get-trend-of-temperature

CREATE TABLE temperature_log(
    ID INT NOT NULL,
    DT DATE NOT NULL,
    temperature DECIMAL(5,2) NOT NULL)
;

-- https://www.oracletutorial.com/oracle-basics/oracle-date/

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


SELECT x.*
     , x.temperature - y.temperature diff
     , COUNT(*) cnt
     ,(x.temperature-y.temperature)/COUNT(*) trend 
  FROM temperature_log x 
  JOIN temperature_log y 
    ON y.id < x.id 
 GROUP 
    BY x.id;
