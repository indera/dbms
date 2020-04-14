
-- account
CREATE INDEX district_id ON account(district_id);
CREATE INDEX created_date ON account(created_date);


-- transaction
CREATE INDEX trans_created_date ON transaction(created_date, trans_type);
CREATE INDEX trans_amount ON transaction(amount);
CREATE INDEX trans_balance ON transaction(balance);
CREATE INDEX trans_category ON transaction(category);


-- client
CREATE INDEX birth_date ON client(birth_date);



-- disposition
CREATE INDEX disp_type ON disposition(disp_type);


-- card
CREATE INDEX issued_date_card_type ON card(issued_date, card_type);


-- loan
CREATE INDEX loan_date ON loan(loan_date);
