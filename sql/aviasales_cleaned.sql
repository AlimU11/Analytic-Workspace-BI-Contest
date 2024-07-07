SELECT
    f.booking_id
  , f.booking_month booking_month_num
  , f.passengers
  , f.price
  , COALESCE(f.flight.origin, 'Не указан') origin_code
  , COALESCE(f.flight.destination, 'Не указан') destination_code
  , COALESCE(f.flight.airline, 'Не указан') airline_code
  , CASE
        WHEN f.flight.baggage = 'With baggage' THEN 'С багажом'
        WHEN f.flight.baggage = 'No baggage' THEN 'Без багажа'
        ELSE 'Не указано'
    END baggage
  , f.flight_subseq
  , f.subseq_num
  , f.price / f.passengers / MAX(f.flight_subseq) OVER (
        PARTITION BY
            f.booking_id
    ) avg_price_per_person
FROM
    (
        SELECT
            f.booking_id
          , f.booking_month
          , f.passengers
          , f.price
          , EXPLODE (
                FROM_JSON(
                    f.flights_info
                  , 'array<struct<origin:string,destination:string,airline:string,baggage:string>>'
                )
            ) flight
          , ROW_NUMBER() OVER (
                PARTITION BY
                    f.booking_id
                ORDER BY
                    (
                        SELECT
                            NULL
                    )
            ) flight_subseq
          , COUNT(f.booking_id) OVER (
                PARTITION BY
                    f.booking_id
            ) - 1 subseq_num
        FROM
            `default` f
    ) f