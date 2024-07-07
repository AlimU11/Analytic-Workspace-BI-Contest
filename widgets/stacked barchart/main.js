function renderPlotly(df) {
  const airlineAvgPrices = df
    .groupby(["airline_name"])
    .agg({ avg_price_per_person: "mean" });
  airlineAvgPrices.rename(
    { avg_price_per_person_mean: "avg_of_avg_price" },
    { inplace: true }
  );

  airlineAvgPrices.sortValues("avg_of_avg_price", {
    ascending: false,
    inplace: true,
  });
  const topAirlines = airlineAvgPrices.head(4)["airline_name"].values;

  df = df.addColumn(
    "airline_category",
    df["airline_name"].apply((airline) =>
      topAirlines.includes(airline) ? airline : "Другие"
    )
  );

  const airportCategoryAvgPrices = df
    .groupby(["airport_origin", "airline_category"])
    .agg({ avg_price_per_person: "mean" });

  const airportSumAvgPrices = airportCategoryAvgPrices
    .groupby(["airport_origin"])
    .agg({ avg_price_per_person_mean: "sum" });
  airportSumAvgPrices.rename(
    { avg_price_per_person_mean_sum: "sum_of_avg_price" },
    { inplace: true }
  );

  airportSumAvgPrices.sortValues("sum_of_avg_price", {
    ascending: true,
    inplace: true,
  });
  const sortedAirports = airportSumAvgPrices["airport_origin"].values;

  const uniqueCategories = df["airline_category"].unique().values;

  const patterns = ["", ".", "-", "x", "|"];
  let traces = [];

  uniqueCategories.forEach((category, index) => {
    let categoryPrices = [];

    sortedAirports.forEach((airport) => {
      let filteredDf = df.query(
        df["airport_origin"]
          .eq(airport)
          .and(df["airline_category"].eq(category))
      );
      let avgPrice =
        filteredDf.shape[0] > 0 ? filteredDf["avg_price_per_person"].mean() : 0;
      categoryPrices.push(avgPrice);
    });

    traces.push({
      y: sortedAirports,
      x: categoryPrices,
      name: category,
      type: "bar",
      orientation: "h",
      marker: {
        color:
          patterns[index % patterns.length].length > 0 ? "#6ebaff" : "#daeaff",
        pattern: {
          shape: patterns[index % patterns.length],
          bgcolor: "#daeaff",
        },
      },
      texttemplate: "%{x:.1s}",
      mode: "text",
      textposition: "top center",
    });
  });

  let layout = {
    title: {
      text: '<b>Средняя цена билета</b> <br><span style="font-size: 16px">по аэропорту отправления и авиакомпании</span>',
      x: 0,
      y: 0.97,
    },
    barmode: "stack",
    margin: {
      l: 100,
      r: 24,
      t: 100,
      b: 0,
      pad: 0,
    },
    height: 712,
    font: {
      color: "#0c131d",
      family:
        "Stapel, -apple-system BlinkMacSystemFont, Inter, Roboto, Helvetica, Arial, sans-serif",
    },
    yaxis: {
      zeroline: false,
      showgrid: true,
      gridcolor: "#e1e5ec",
    },
    xaxis: {
      zeroline: false,
      showgrid: false,
      showticklabels: true,
      side: "top",
    },
    legend: {
      orientation: "h",
      x: -0.2,
      y: 1.07,
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

  Plotly.newPlot("graph", traces, layout, config);
}

function render() {
  var data = window.DATA.data;

  const transformedData = data.map((item) => {
    const avgPrice = item.avg_price_per_person.agg_value;
    const [airport_origin, airline_name] =
      item.calc__airport_origin_airline.value.split(",");

    return { airport_origin, airline_name, avg_price_per_person: avgPrice };
  });

  const df = new dfd.DataFrame(transformedData);
  setupExportButtons(df);

  renderPlotly(df);
}
