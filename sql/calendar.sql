SELECT
    t.month_num
  , t.month_name
  , RIGHT('0' || t.month_num, 2) || '. ' || t.month_name month_ordered
FROM
VALUES
    (1, 'Январь')
  , (2, 'Февраль')
  , (3, 'Март')
  , (4, 'Апрель')
  , (5, 'Май')
  , (6, 'Июнь')
  , (7, 'Июль')
  , (8, 'Август')
  , (9, 'Сентябрь')
  , (10, 'Октябрь')
  , (11, 'Ноябрь')
  , (12, 'Декабрь') AS t (month_num, month_name)