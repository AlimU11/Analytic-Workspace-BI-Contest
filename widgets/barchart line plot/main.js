function renderPlot(df, is_checked) {
  function formatTick(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  var data = {
    x: df["month"].values,
    y: is_checked ? df["price"].values : df["passengers"].values,
    type: is_checked ? "line" : "bar",
    mode: "lines+markers+text",
    marker: {
      color: is_checked ? "#ffffff" : "#fa742d",
      size: 10,
      line: {
        width: 2,
        color: is_checked ? "#0c73fe" : "#fa742d",
      },
    },
    line: {
      width: 2,
      color: is_checked ? "#0c73fe" : "#fa742d",
    },
    texttemplate: is_checked ? "%{y:.3s}" : "%{y:.0s}",
    textposition: "top",
    textfont: {
      color: is_checked ? "#0c131d" : "#ffffff",
    },
  };

  var layout = {
    margin: {
      l: 48,
      r: 24,
      t: 48,
      b: 32,
    },
    title: {
      text: `<b>Динамика ${is_checked ? "продаж" : "пассажиропотока"}<b>`,
      x: 0.07,
      font: {
        family:
          "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif",
      },
    },
    hovermode: "x unified",
    font: {
      color: "#0c131d",
      family:
        "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif",
    },
    xaxis: {
      showgrid: false,
      zeroline: false,
    },
    yaxis: {
      zeroline: false,
      gridcolor: "#e1e5ec",
      range: [
        is_checked ? df["price"].min() * 0.9 : 0,
        is_checked ? df["price"].max() * 1.1 : df["passengers"].max() * 1.1,
      ],
      // tickvals: is_checked ? df['price'].values : df['passengers'].values,
      //ticktext: is_checked ? df['price'].values : df['passengers'].values.map(formatTick)
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

  Plotly.newPlot("graph", [data], layout, config);
}

function render() {
  if (!window.DATA) return;

  let data = window.DATA.data;

  months = data.map((item) => item.month_name.value);
  prices = data.map((item) => item.price.agg_value);
  passengers = data.map((item) => item.passengers.agg_value);
  df = new dfd.DataFrame({
    month: months,
    price: prices,
    passengers: passengers,
  });
  setupExportButtons(df);

  let toggle = document.querySelector(".form-check-input");

  renderPlot(df, toggle.checked);

  toggle.addEventListener("change", function () {
    let aggType = this.checked;

    renderPlot(df, aggType);
  });
}
