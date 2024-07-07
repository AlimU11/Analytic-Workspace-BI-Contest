let isFirstRender = true;

function render() {
  if (!isFirstRender) return;

  let data = window.DATA["total"];

  let total_passangers = data["passengers"].value;
  let kpi_total_passangers = document
    .getElementById("total_passangers")
    .querySelector("b");
  kpi_total_passangers.textContent = new Intl.NumberFormat("ru-RU").format(
    total_passangers
  );

  let total_sales = data["price"].value;
  let kpi_total_sales = document
    .getElementById("total_sales")
    .querySelector("b");
  kpi_total_sales.textContent =
    new Intl.NumberFormat("ru-RU").format(total_sales) + "₽";

  let avg_price = data["avg_price_per_person"].value;
  let kpi_avg_price = document.getElementById("avg_price").querySelector("b");
  kpi_avg_price.textContent =
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(
      avg_price
    ) + "₽";

  let most_frequent_direction = data["most_frequent"].value;
  let kpi_most_frequent_direction = document
    .getElementById("most_frequent_direction")
    .querySelector("b");
  kpi_most_frequent_direction.textContent = most_frequent_direction;

  let most_popular_airline = data["most_frequent_airline"].value;
  let kpi_most_popular_airline = document
    .getElementById("most_popular_airline")
    .querySelector("b");
  kpi_most_popular_airline.textContent = most_popular_airline;

  let most_popular_booking_month = data["most_frequent_month"].value;
  let kpi_most_popular_booking_month = document
    .getElementById("most_popular_booking_month")
    .querySelector("b");
  kpi_most_popular_booking_month.textContent = most_popular_booking_month;
}
