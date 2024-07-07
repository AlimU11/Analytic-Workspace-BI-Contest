SELECT
    *
FROM
VALUES
    ('Не указан', 'Не указан', 'Не указана', NULL, 'Не указан', NULL, NULL)
  , ('LED', 'Пулково', 'Россия', 'RUS', 'Санкт-Петербург', 30.3083, 59.806084)
  , ('HKT', 'Пхукет', 'Таиланд', 'THA', 'Пхукет', 98.306435, 8.107619)
  , ('MCT', 'Маскат', 'Оман', 'OMN', 'Маскат', 58.29022, 23.588078)
  , ('PVG', 'Пудун', 'Китай', 'CHN', 'Шанхай', 121.799805, 31.151825)
  , ('TFU', 'Чэнду Тяньфу', 'Китай', 'CHN', 'Чэнду', 104.55518623977798, 30.403575775662205)
  , ('AUH', 'Абу-Даби', 'ОАЭ', 'ARE', 'Абу-Даби', 54.645973, 24.426912)
  , ('PEK', 'Пекин', 'Китай', 'CHN', 'Пекин', 116.5871, 40.078537)
  , ('XIY', 'Сиань', 'Китай', 'CHN', 'Сиань', 108.75605, 34.441154)
  , ('DOH', 'Доха', 'Катар', 'QAT', 'Доха', 51.558067, 25.267569)
  , ('KJA', 'Емельяново', 'Россия', 'RUS', 'Красноярск', 92.48286, 56.18113)
  , ('SVO', 'Шереметьево', 'Россия', 'RUS', 'Москва', 37.416573, 55.966324)
  , ('VKO', 'Внуково', 'Россия', 'RUS', 'Москва', 37.2921, 55.60315)
  , ('DME', 'Домодедово', 'Россия', 'RUS', 'Москва', 37.899494, 55.414566) AS t (
        {direction}_airport_code
      , {direction}_airport_name
      , {direction}_airport_country
      , {direction}_airport_country_code
      , {direction}_airport_city
      , {direction}_airport_latitude
      , {direction}_airport_longitude
    )
;