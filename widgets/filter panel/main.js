const monthOrder = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

var isFirstInit = true;

function render() {
  if (!isFirstInit) return;

  isFirstInit = false;

  var data = window.DATA.data;

  const min_price = data.map((item) => item.min_price.value);
  const max_price = data.map((item) => item.max_price.value);
  const min_flights = data.map((item) => item.min_flights.value);
  const max_flights = data.map((item) => item.max_flights.value);
  const min_passengers = data.map((item) => item.min_passengers.value);
  const max_passengers = data.map((item) => item.max_passengers.value);
  const month = data.map((item) => item.month_name.value);
  const baggage = data.map((item) => item.baggage.value);
  const airline = data.map((item) => item.airline_name.value);
  const airport_origin = data.map((item) => item.origin_airport_name.value);
  const airport_destination = data.map(
    (item) => item.destination_airport_name.value
  );

  const df = new dfd.DataFrame({
    min_price: min_price,
    max_price: max_price,
    min_flights: min_flights,
    max_flights: max_flights,
    min_passengers: min_passengers,
    max_passengers: max_passengers,
    month: month,
    baggage: baggage,
    airline: airline,
    airport_origin: airport_origin,
    airport_destination: airport_destination,
  });

  df.print();

  initFilters(df);
}

const applyFilters = (
  df,
  baggageChoices,
  monthChoices,
  airlineChoices,
  originChoices,
  destinationChoices,
  priceSlider,
  passengerSlider,
  flightSlider
) => {
  const baggageValues = baggageChoices.getValue(true);
  setFilter("baggage", baggageValues, "=");

  const monthValues = monthChoices.getValue(true);
  setFilter("month_name", monthValues, "=");

  const airlineValues = airlineChoices.getValue(true);
  setFilter("airline_name", airlineValues, "=");

  const originValues = originChoices.getValue(true);
  setFilter("origin_airport_name", originValues, "=");

  const destinationValues = destinationChoices.getValue(true);
  setFilter("destination_airport_name", destinationValues, "=");

  const price = priceSlider.noUiSlider.get();
  setFilter("max_price", price, "<=");

  const passengerRange = passengerSlider.noUiSlider.get().map(Number);
  setFilter(
    "min_passengers",
    Array.from(
      { length: passengerRange[1] - passengerRange[0] + 1 },
      (_, i) => passengerRange[0] + i
    ),
    ">="
  );

  const flightRange = flightSlider.noUiSlider.get().map(Number);
  setFilter(
    "min_flights",
    Array.from(
      { length: flightRange[1] - flightRange[0] + 1 },
      (_, i) => flightRange[0] + i
    ),
    ">="
  );
};

function resetFilters(
  df,
  baggageChoices,
  monthChoices,
  airlineChoices,
  originChoices,
  destinationChoices,
  priceSlider,
  passengerSlider,
  flightSlider
) {
  baggageChoices.clearStore();
  baggageChoices.setValue(
    df["baggage"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label"
  );

  monthChoices.clearStore();
  monthChoices.setValue(
    df["month"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label"
  );

  airlineChoices.clearStore();
  airlineChoices.setValue(
    df["airline"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label"
  );

  originChoices.clearStore();
  originChoices.setValue(
    df["airport_origin"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label"
  );

  destinationChoices.clearStore();
  destinationChoices.setValue(
    df["airport_destination"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label"
  );

  priceSlider.noUiSlider.set([df["max_price"].max()]);
  passengerSlider.noUiSlider.set([
    df["min_passengers"].min(),
    df["max_passengers"].max(),
  ]);
  flightSlider.noUiSlider.set([
    df["min_flights"].min(),
    df["max_flights"].max(),
  ]);

  applyFilters(
    df,
    baggageChoices,
    monthChoices,
    airlineChoices,
    originChoices,
    destinationChoices,
    priceSlider,
    passengerSlider,
    flightSlider
  );

  baggageChoices.removeActiveItems();
  monthChoices.removeActiveItems();
  airlineChoices.removeActiveItems();
  originChoices.removeActiveItems();
  destinationChoices.removeActiveItems();
}

const _initFilters = (
  df,
  baggageChoices,
  monthChoices,
  airlineChoices,
  originChoices,
  destinationChoices
) => {
  baggageChoices.setChoices(
    df["baggage"]
      .unique()
      .values.map((b) => ({ value: String(b), label: String(b) })),
    "value",
    "label",
    false
  );
  monthChoices.setChoices(
    df["month"]
      .unique()
      .values.map((m) => ({ value: String(m), label: String(m) })),
    "value",
    "label",
    false
  );
  airlineChoices.setChoices(
    df["airline"]
      .unique()
      .values.map((a) => ({ value: String(a), label: String(a) })),
    "value",
    "label",
    false
  );
  originChoices.setChoices(
    df["airport_origin"]
      .unique()
      .values.map((o) => ({ value: String(o), label: String(o) })),
    "value",
    "label",
    false
  );
  destinationChoices.setChoices(
    df["airport_destination"]
      .unique()
      .values.map((d) => ({ value: String(d), label: String(d) })),
    "value",
    "label",
    false
  );
};

const initFilters = (df) => {
  const baggageChoices = new Choices("#baggageFilter", {
    removeItemButton: true,
    removeItems: true,
    placeholderValue: "Наличие багажа",
    allowHTML: false,
    noResultsText: "Ничего не найдено",
    noChoicesText: "Нет вариантов для выбора",
    itemSelectText: "Нажмите для выбора",
  });
  const monthChoices = new Choices("#monthFilter", {
    removeItemButton: true,
    removeItems: true,
    placeholderValue: "Месяц",
    allowHTML: false,
    noResultsText: "Ничего не найдено",
    noChoicesText: "Нет вариантов для выбора",
    itemSelectText: "Нажмите для выбора",
    sorter: function (a, b) {
      return monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label);
    },
  });
  const airlineChoices = new Choices("#airlineFilter", {
    removeItemButton: true,
    removeItems: true,
    placeholderValue: "Авиакомпания",
    maxItemText: 1,
    allowHTML: false,
    noResultsText: "Ничего не найдено",
    noChoicesText: "Нет вариантов для выбора",
    itemSelectText: "Нажмите для выбора",
  });
  const originChoices = new Choices("#originFilter", {
    removeItemButton: true,
    removeItems: true,
    placeholderValue: "Откуда",
    allowHTML: false,
    noResultsText: "Ничего не найдено",
    noChoicesText: "Нет вариантов для выбора",
    itemSelectText: "Нажмите для выбора",
  });
  const destinationChoices = new Choices("#destinationFilter", {
    removeItemButton: true,
    removeItems: true,
    placeholderValue: "Куда",
    allowHTML: false,
    noResultsText: "Ничего не найдено",
    noChoicesText: "Нет вариантов для выбора",
    itemSelectText: "Нажмите для выбора",
  });

  const priceSlider = document.getElementById("priceSlider");
  noUiSlider.create(priceSlider, {
    start: [df["max_price"].max()],
    connect: [true, false],
    range: {
      min: df["min_price"].min(),
      max: df["max_price"].max(),
    },
    tooltips: true,
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => Number(value),
    },
  });

  const passengerSlider = document.getElementById("passengerSlider");
  noUiSlider.create(passengerSlider, {
    start: [df["min_passengers"].min(), df["max_passengers"].max()],
    connect: true,
    range: {
      min: df["min_passengers"].min(),
      max: df["max_passengers"].max(),
    },
    tooltips: true,
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => Number(value),
    },
  });

  const flightSlider = document.getElementById("flightSlider");
  noUiSlider.create(flightSlider, {
    start: [df["min_flights"].min(), df["max_flights"].max()],
    connect: true,
    range: {
      min: df["min_flights"].min(),
      max: df["max_flights"].max(),
    },
    tooltips: true,
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => Number(value),
    },
  });

  _initFilters(
    df,
    baggageChoices,
    monthChoices,
    airlineChoices,
    originChoices,
    destinationChoices
  );

  baggageChoices.passedElement.element.addEventListener("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  monthChoices.passedElement.element.addEventListener("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  airlineChoices.passedElement.element.addEventListener("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  originChoices.passedElement.element.addEventListener("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  destinationChoices.passedElement.element.addEventListener("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });

  priceSlider.noUiSlider.on("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  passengerSlider.noUiSlider.on("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
  flightSlider.noUiSlider.on("change", () => {
    applyFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    resetFilters(
      df,
      baggageChoices,
      monthChoices,
      airlineChoices,
      originChoices,
      destinationChoices,
      priceSlider,
      passengerSlider,
      flightSlider
    );
  });
};
