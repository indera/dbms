from api.main import app
from api.dbutils import fetch_data_as_json, fetch_data

@app.route('/api/getTotalAmountOfLoansPerDistrict')
def transaction_balance1():
    # From q1
    description = "Group the loan by district and calculate the total amount of loan on each date in each district"
    sql = """
    SELECT SUM(LOAN.amount) As LOAN_SUM, TO_CHAR(loan.start_DATE, 'YYYY-MM') AS month, DISTRICT_detail.district_id
        FROM dmelisso.LOAN LOAN
         JOIN dmelisso.account ACCOUNT
                        ON ACCOUNT.account_id = LOAN.account_id
         JOIN dmelisso.DISTRICT_detail
                        ON DISTRICT_detail.district_id = ACCOUNT.district_id
        GROUP BY TO_CHAR(loan.start_DATE, 'YYYY-MM'), DISTRICT_detail.district_id
        ORDER BY TO_CHAR(loan.start_DATE, 'YYYY-MM')
    """
    json_data = fetch_data(sql, description)
    return json_data


@app.route('/api/getTotalAmountOfCreditCardsIssuedPerMonth')
def transaction_balance2():
    # From q1
    description = "Calculate the amount of cards issued on each month"
    sql = """
   SELECT COUNT(CARD.card_id) AS Number_Of_Cards, TO_CHAR(CARD.issued, 'YYYY-MM') AS month
        FROM dmelisso.CARD
         JOIN dmelisso.DISPOSITION
                        ON DISPOSITION.disp_id = CARD.disp_id
         JOIN dmelisso.ACCOUNT
                        ON ACCOUNT.account_id = DISPOSITION.account_id
        GROUP BY TO_CHAR(CARD.issued, 'YYYY-MM')
        ORDER BY TO_CHAR(CARD.issued, 'YYYY-MM')
    """
    json_data = fetch_data(sql, description)
    return json_data
