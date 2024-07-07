function renderPlotly(df, aggType) {
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
  const uniqueAirlines = df["airline"].unique().values;
  const uniqueMonths = [...new Set(df["month"].unique().values)].sort(
    (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
  );

  const airlineTotals = uniqueAirlines.reduce((acc, airline) => {
    acc[airline] = 0;
    return acc;
  }, {});

  let values = aggType ? df["price"].values : df["passengers"].values;
  values.forEach((value, index) => {
    airlineTotals[df["airline"].values[index]] += value;
  });

  uniqueAirlines.sort((a, b) => airlineTotals[a] - airlineTotals[b]);

  const z = uniqueAirlines.map(() => uniqueMonths.map(() => 0));

  values.forEach((value, index) => {
    const airlineIndex = uniqueAirlines.indexOf(df["airline"].values[index]);
    const monthIndex = uniqueMonths.indexOf(df["month"].values[index]);
    z[airlineIndex][monthIndex] = value;
  });

  var colorscaleValue = [
    [0, "#e1e5ec"],
    [1, aggType ? "#0c73fe" : "#fa742d"],
  ];

  var data = [
    {
      z: z,
      x: uniqueMonths,
      y: uniqueAirlines,
      type: "heatmap",
      hoverongaps: true,
      showscale: false,
      colorscale: colorscaleValue,
      xgap: 1,
      ygap: 1,
      hovertemplate: `Месяц: %{x}<br>Авиакомпания: %{y}<br> ${
        aggType ? "Продажи" : "Пассажиров"
      }: %{z:.5s}<extra></extra>`,
      texttemplate: aggType ? "%{z:.3s}" : "%{z}",
    },
  ];

  var layout = {
    margin: {
      l: 150,
      r: 50,
      t: 75,
      b: 25,
    },
    font: {
      size: 12,
      font_family:
        "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif;",
      color: "#0c131d",
    },
    xaxis: {
      ticks: "",
      side: "top",
      showgrid: false,
    },
    yaxis: {
      ticks: "",
      ticksuffix: " ",
      showgrid: false,
      autosize: false,
    },
    height: 80 + 60 * uniqueAirlines.length,
    width: 200 + 65 * uniqueMonths.length,
  };

  config = {
    displayModeBar: true,
    modeBarButtonsToRemove: [
      "zoom2d",
      "pan2d",
      "select2d",
      "lasso2d",
      "zoomIn2d",
      "zoomOut2d",
      "autoScale2d",
    ],
    displaylogo: false,
  };

  Plotly.newPlot("graph", data, layout, config);
}

function render() {
  data = window.DATA.data;

  let toggle = document.querySelector(".form-check-input");
  let label = document.querySelector(".form-check-label");

  const transformedData = data.map((item) => {
    const [airline, month] = item.calc__airline_month.value.split(",");
    const price = item.price.agg_value;
    const passengers = item.passengers.agg_value;

    return { airline, month, price, passengers };
  });

  df = new dfd.DataFrame(transformedData);
  setupExportButtons(df);

  label.innerHTML = toggle.checked
    ? "<b>Динамика продаж</b><br><span style='font-size: 16px'> по авиакомпаниям</span>"
    : "<b>Динамика пассажиропотока</b><br><span style='font-size: 16px'> по авиакомпаниям</span>";

  renderPlotly(df, toggle.checked);

  toggle.addEventListener("change", function () {
    let aggType = this.checked;
    label.innerHTML = aggType
      ? "<b>Динамика продаж</b><br><span style='font-size: 16px'> по авиакомпаниям</span>"
      : "<b>Динамика пассажиропотока</b><br><span style='font-size: 16px'> по авиакомпаниям</span>";

    renderPlotly(df, aggType);
  });
}
