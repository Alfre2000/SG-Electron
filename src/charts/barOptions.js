export const options = {
  maintainAspectRatio: false,
  responsive: true,
  barPercentage: 0.9,
  borderRadius: 2,
  borderColor: "#007eb8",
  hoverBorderWidth: 2,
  scales: {
    y: {
      grace: "5%",
      title: {
        display: true,
        text: "N° pezzi prodotti",
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        title: function (tooltipItems) {
          return tooltipItems[0].label;
        },
        label: function (context) {
          var label = context.dataset.label || "";
          if (label) {
            label += ": ";
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString();
          }
          return label + " pezzi";
        },
      },
      backgroundColor: "rgba(245, 246, 247, 0.9)",
      titleColor: "rgba(1, 54, 145, 1)",
      bodyColor: "rgba(1, 54, 145, 1)",
      footerColor: "rgba(1, 54, 145, 1)",
      borderColor: "rgb(0, 46, 92)",
      borderWidth: 1,
      padding: {
        y: 10,
        left: 10,
        right: 20,
      },
      displayColors: false,
      titleFont: {
        size: 13,
      },
      bodyFont: {
        size: 13,
      },
      footerFont: {
        size: 13,
        weight: "normal",
      },
      footerMarginTop: 4,
      cornerRadius: 4,
      titleMarginBottom: 5,
    },
  },
};
