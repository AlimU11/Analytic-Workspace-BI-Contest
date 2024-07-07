function renderPlotly(df) {
  let groupedDf = df
    .groupby(["airline_name"])
    .agg({ avg_price_per_person: "mean" })
    .sortValues("avg_price_per_person_mean", { ascending: true });
  let sortedAirlines = groupedDf["airline_name"].values;
  df = df.addColumn(
    "airline_name_category",
    df["airline_name"].apply((airline) => sortedAirlines.indexOf(airline))
  );
  df = df.sortValues("airline_name_category");

  let airlineNames = df["airline_name"].values;
  let avgPrices = df["avg_price_per_person"].values;

  let trace = {
    type: "scatter",
    mode: "markers",
    x: avgPrices,
    y: airlineNames,
    marker: {
      size: 10,
      color: "#ffffff",
      line: {
        color: "#0c73fe",
        width: 1,
      },
    },
  };

  let layout = {
    title: {
      text: '<b>Распределение цен билетов</b><br><span style="font-size: 16px">по авиакомпаниям</span>',
      x: 0,
      y: 0.975,
    },
    xaxis: {
      zeroline: false,
      showgrid: false,
      side: "top",
    },
    yaxis: {
      type: "category",
      zeroline: false,
      gridcolor: "#e1e5ec",
      range: [-0.3, df["airline_name"].unique().values.length],
    },
    margin: {
      l: 150,
      r: 24,
      t: 75,
      b: 0,
      pad: 0,
    },
    height: 712,
    font: {
      color: "#0c131d",
      family:
        "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif",
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

  Plotly.newPlot("graph", [trace], layout, config);
}

function render() {
  data = window.DATA.data;
  let airlineNames = [];
  let avgPrices = [];

  data.forEach((item) => {
    const airlineName = item.airline_name.value;
    const avgPricesStr = item.avg_price_per_person.agg_value.split(",");

    avgPricesStr.forEach((price) => {
      airlineNames.push(airlineName);
      avgPrices.push(parseFloat(price));
    });
  });

  const df = new dfd.DataFrame({
    airline_name: airlineNames,
    avg_price_per_person: avgPrices,
  });

  setupExportButtons(df);
  renderPlotly(df);
}
