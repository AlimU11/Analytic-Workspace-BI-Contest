let isFirstRender = true;
let groupData = {};

function renderPlotly(airport_index, source, target, value, aggType) {
  function formatNumberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  var data = {
    type: "sankey",
    orientation: "h",
    node: {
      pad: 15,
      thickness: 30,
      line: {
        color: "#cdd4de",
      },
      label: Object.keys(airport_index)
        .sort((a, b) => airport_index[a] - airport_index[b])
        .map((key) => key.split("_")[0]),
      color: aggType ? "#0c73fe" : "#fa742d",
      hovertemplate: "%{label}: %{value}<extra></extra>",
      customdata: value.map((v) => formatNumberWithSpaces(v)),
    },
    link: {
      source: source,
      target: target,
      value: value,
      hovertemplate:
        "Аэропорт отправления: %{source.label}<br>" +
        "Аэропорт прибытия: %{target.label}<br>" +
        `${aggType ? "Сумма продаж" : "Количество пассажиров"}: ` +
        "%{customdata}" +
        `${aggType ? "₽" : ""}<extra></extra>`,
      customdata: value.map((v) => formatNumberWithSpaces(v)),
      hoverinfo: "text",
      color: "#eff1f4",
    },
  };

  var layout = {
    title: {
      text: `<b>Распределение ${
        aggType ? "продаж" : "пассажиропотока"
      }</b><br><span style='font-size: 16px'>по направлениям полетов</span>`,
      x: 0.05,
      size: 50,
      y: 0.96,
      font: {
        family:
          "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif",
      },
    },
    font: {
      size: 12,
      font_family:
        "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif;",
      color: "#0c131d",
    },
    margin: {
      t: 60,
      l: 0,
      r: 0,
      b: 50,
      pad: 5,
    },
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

  Plotly.react("graph", [data], layout, config);
}

function prepareGroupData(df) {
  var unique_airports = [
    ...new Set([
      ...df["origin_airport"].values,
      ...df["arrival_airport"].values,
    ]),
  ].reverse();

  var airport_index = {};
  var counter = 0;

  unique_airports.forEach((airport) => {
    airport_index[airport + "_origin"] = counter++;
    airport_index[airport + "_destination"] = counter++;
  });

  var source = df["origin_airport"].values.map(
    (airport) => airport_index[airport + "_origin"]
  );
  var target = df["arrival_airport"].values.map(
    (airport) => airport_index[airport + "_destination"]
  );

  return { airport_index, source, target };
}

function getValueArray(data, aggType) {
  return data.map((item) =>
    aggType ? item.price.agg_value : item.passengers.agg_value
  );
}

function render() {
  if (!window.DATA) return;

  let data = window.DATA.data;

  const transformedData = data.map((item) => {
    const [origin_airport, arrival_airport] =
      item.calc__destination.value.split(",");
    const price = item.price.agg_value;
    const passengers = item.passengers.agg_value;

    return { origin_airport, arrival_airport, price, passengers };
  });

  const df = new dfd.DataFrame(transformedData);
  setupExportButtons(df);

  groupData = prepareGroupData(df);

  let toggle = document.querySelector(".form-check-input");
  let value = getValueArray(data, toggle.checked);

  renderPlotly(
    groupData.airport_index,
    groupData.source,
    groupData.target,
    value,
    toggle.checked
  );

  toggle.addEventListener("change", function () {
    let aggType = this.checked;
    let value = getValueArray(data, aggType);

    renderPlotly(
      groupData.airport_index,
      groupData.source,
      groupData.target,
      value,
      aggType
    );
  });
}
