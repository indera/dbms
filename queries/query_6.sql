-- Shangde:
-- Query 1: group the loan by district and calculate the total amount of loan on each date in each district
SELECT SUM(LOAN.amount),
       LOAN.start_date
FROM dmelisso.LOAN LOAN
         JOIN dmelisso.account ACCOUNT
              on ACCOUNT.account_id = LOAN.account_id
         JOIN dmelisso.DISTRICT_detail on DISTRICT_detail.district_id = ACCOUNT.district_id
GROUP BY LOAN.start_date, DISTRICT_detail.district_id
ORDER BY LOAN.start_date;

-- Query 2: group the card by district and calculate the amount of card issued on each date in each district
SELECT COUNT(CARD.card_id) AS number_of_cards
FROM dmelisso.CARD
         JOIN dmelisso.DISPOSITION
              on DISPOSITION.disp_id = CARD.disp_id
         JOIN dmelisso.ACCOUNT on ACCOUNT.account_id = DISPOSITION.account_id
         JOIN dmelisso.DISTRICT_detail on DISTRICT_detail.district_id = ACCOUNT.district_id
GROUP BY CARD.issued,
         DISTRICT_detail.district_id;
