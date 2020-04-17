-- Query 1: group the loan by district and calculate the total amount of loan on each date in each district


SELECT
    SUM(LOAN.amount) FROM dmelisso.LOAN LOAN 
    JOIN dmelisso.account ACCOUNT on ACCOUNT.account_id = LOAN.account_id
    JOIN dmelisso.DISTRICT on DISTRICT.district_id = ACCOUNT.district_id
GROUP
    BY LOAN.date, DISTRICT.district_id
;


-- Query 2: group the card by district and calculate the amount of card issued on each date in each district
SELECT
    COUNT(CARD.card_id)
FROM
    dmelisso.CARD
    JOIN dmelisso.DISPOSITION on DISPOSITION.disp_id = CARD.disp_id
    JOIN dmelisso.ACCOUNT on ACCOUNT.account_id = DISPOSITION.account_id
    JOIN dmelisso.DISTRICT on DISTRICT.district_id = ACCOUNT.district_id
GROUP BY
    CARD.issued_date, DISTRICT.district_id
;
