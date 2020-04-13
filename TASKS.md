
# Tasks

- Shangde order.asc
- Srija disp.asc, client.asc (this is fun one too)
- Mukul loan.asc
- Dimitrios region  (have fun)
- Andrei district.asc, trans.csv (account done?)


# TA feedback

-5. For the relation between disposition and card, the cardinality specified by
the ER is 1:1. The SQL implementation for `card` has card_id as a primary key and
`disp_id` as a foreign key. This does not ensure a 1:1 relationship. As the
relationship is 1:1, having `disp_id` as the foreign key and primary key in `card`
will solve this. `card_id` is not required as the relationship is 1:1, `disp_id` by
itself will be enough to identify every tuple in card. The same applies for all
1:1 relations like `client` to `disposition` also. As the relation is 1:1, `disp_id`
will be able to uniqule identify every client.

