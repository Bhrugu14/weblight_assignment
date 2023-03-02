export const chartOptionConst = {
  chart: {
    type: "column",
  },
  title: {
    text: `Weekly Additions and Deletions`,
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: {
      text: "Number of Changes",
    },
  },
  series: [
    {
      name: "Additions",
      data: [],
    },
    {
      name: "Deletions",
      data: [],
    },
  ],
};

export const chartContributorConst = {
  title: {
    text: "Weekly Activity by Contributor",
  },
  xAxis: {
    categories: ["Additions", "Deletions", "Commits"],
  },
  yAxis: {
    title: {
      text: "Count",
    },
  },
  series: [],
};

export const chartWeeklyConst = {
  chart: {
    type: "line",
  },
  title: {
    text: `Weekly Commits`,
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    title: {
      text: "Number of Commits",
    },
  },
  series: [
    {
      name: "Commits",
      data: [],
    },
  ],
};
