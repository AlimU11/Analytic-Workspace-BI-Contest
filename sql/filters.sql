SELECT DISTINCT
  a.baggage
, a.month_name
, a.airline_name
, a.origin_airport_name
, a.destination_airport_name
, MIN(a.avg_price_per_person) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) min_price
, MAX(a.avg_price_per_person) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) max_price
, MIN(a.passengers) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) min_passengers
, MAX(a.passengers) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) max_passengers
, MIN(a.subseq_num) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) min_flights
, MAX(a.subseq_num) OVER (
    PARTITION BY
      a.baggage
    , a.month_name
    , a.airline_name
    , a.origin_airport_name
    , a.destination_airport_name
  ) max_flights
FROM
  logic_7741 a