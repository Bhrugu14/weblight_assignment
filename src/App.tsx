import { SetStateAction, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import IcLeftArrow from "./assets/IcLeftArrow";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
// import "./App.css";
import { useAppDispatch, useAppSelector } from "./reduxStore/hooks";
import { GetRepoList, getRepoListAPI } from "./reduxStore/slices/getRepoSlice";
import { CustomChart, Dropdown, Header, Loading } from "./components";
import {
  chartContributorConst,
  chartOptionConst,
  chartWeeklyConst,
  dropdownOptions,
} from "./constant";
import {
  getRepoAdditionDeletion,
  getRepoCommits,
  getRepoContributes,
} from "./service/repoDetails";

function App() {
  const dispatch = useAppDispatch();
  const repoList = useAppSelector(GetRepoList);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [stringValue, setStringValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [incompleteResults, setIncompleteResults] = useState<boolean>(false);
  const [repoData, setRepoData] = useState([]);
  const [selected, setSelected] = useState(dropdownOptions[0]);
  const [chartOptions, setChartOptions] = useState(chartOptionConst);
  const [chartContributeOptions, setChartContributeOptions] = useState(
    chartContributorConst
  );
  const [extra, setExtra] = useState(0);

  const onSetChartRepoName = (string: string) => {
    getRepoAdditionDeletion(string)
      .then((data) => {
        console.log("res", data);
        const weeklyData = data.map(
          ([timestamp, additions, deletions]: [number, number, number]) => ({
            date: new Date(timestamp * 1000).toISOString().substr(0, 10),
            additions,
            deletions,
          })
        );
        console.log("dataHere", weeklyData);
        setChartOptions({
          chart: {
            type: "column",
          },
          title: {
            text: `Weekly Additions and Deletions`,
          },
          xAxis: {
            categories: weeklyData.map((week: { date: string }) => week.date),
          },
          yAxis: {
            title: {
              text: "Number of Changes",
            },
          },
          series: [
            {
              name: "Additions",
              data: weeklyData.map(
                (week: { additions: number }) => week.additions
              ),
            },
            {
              name: "Deletions",
              data: weeklyData.map(
                (week: { deletions: number }) => -week.deletions
              ),
            },
          ],
        });
        setExtra(extra + 1);
      })
      .catch((error) => {
        console.log("error", error);
        setChartOptions(chartOptionConst);
        console.error(error);
      });
  };
  const onSetChartCommits = (string: string) => {
    getRepoCommits(string)
      .then((data) => {
        console.log("dataaa", data);
        const weeklyData = data.map(({ week, total }) => ({
          date: new Date(week * 1000).toISOString().substr(0, 10),
          total,
        }));
        // setData(weeklyData);
        setChartOptions({
          chart: {
            type: "line",
          },
          title: {
            text: `Weekly Commits`,
          },
          xAxis: {
            categories: weeklyData.map((week: { date: string }) => week.date),
          },
          yAxis: {
            title: {
              text: "Number of Commits",
            },
          },
          series: [
            {
              name: "Commits",
              data: weeklyData.map((week: { total: string }) => week.total),
            },
          ],
        });
      })
      .catch((error) => {
        setChartOptions(chartWeeklyConst);
        console.error(error);
      });
  };
  const onSetChartContributions = async (string: string) => {
    try {
      const { data: commits } = await getRepoContributes(string);
      console.log("commits:", commits);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastWeekCommits = commits.filter(
        ({ commit }) => new Date(commit.author.date) > lastWeek
      );

      const commitData = lastWeekCommits.reduce((data, { author, stats }) => {
        const { name, email } = author;
        const key = `${name} <${email}>`;
        data[key] = data[key] || { additions: 0, deletions: 0, commits: 0 };
        if (stats) {
          const { additions, deletions } = stats;
          data[key].additions += additions;
          data[key].deletions += deletions;
        }
        data[key].commits += 1;
        return data;
      }, {});

      const chartData = Object.entries(commitData).map(([name, data]) => ({
        name,
        ...data,
      }));
      setChartContributeOptions({
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
        series: chartData.map(({ name, additions, deletions, commits }) => ({
          name,
          data: [additions, deletions, commits],
        })),
      });
    } catch (error) {
      setChartContributeOptions(chartContributorConst);
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(getRepoListAPI(`&page=${page}`));
  }, []);

  const onLoadMore = () => {
    dispatch(getRepoListAPI(`&page=${page}`));
  };

  useEffect(() => {
    setLoading(true);
    if (!repoList.isLoading) {
      if (Array.isArray(repoList?.repoList?.items)) {
        const hardCopy = JSON.parse(JSON.stringify(repoList?.repoList?.items));
        if (repoList.repoList.incomplete_results) {
          setPage(page + 1);
          setIncompleteResults(true);
        } else {
          setIncompleteResults(false);
        }
        setRepoData(repoData.concat(hardCopy));
        setExtra(extra + 1);
      }
      setLoading(false);
    }
  }, [repoList.isLoading]);

  const onExpandRepo = (
    i: {
      owner?: { avatar_url: string };
      name?: string;
      description?: string;
      score?: number;
      open_issues?: number;
      isExpand: any;
      full_name?: any;
    },
    k: number,
    arr: any[] | ((prevState: never[]) => never[])
  ) => {
    setStringValue(i.full_name);
    if (!i.isExpand) {
      console.log("i.full_name", i.full_name);
      onSetChartRepoName(i.full_name);
      onSetChartContributions(i.full_name);
      arr.map((j) => {
        j.isExpand = false;
        return j;
      });
      arr[k].isExpand = !i.isExpand;
    } else {
      arr[k].isExpand = !i.isExpand;
    }
    setRepoData(arr);
    setExtra(extra + 1);
  };

  return (
    <div
      className={`relative w-full h-full px-5 pt-11 bg-white py-2 transition-all duration-500 ${
        isLoading && "overflow-hidden"
      }`}
    >
      <Header title={"Repo List"} />
      {isLoading && <Loading />}
      {repoData.map(
        (
          i: {
            owner: { avatar_url: string };
            name: string;
            description: string;
            score: number;
            open_issues: number;
            isExpand?: boolean;
          },
          k,
          arr
        ) => {
          return (
            <div
              className="bg-white flex flex-col rounded-md shadow-md my-3 p-2 transition-all duration-500"
              key={"repoListData" + k}
            >
              <div className="w-full flex">
                <img
                  src={i.owner.avatar_url}
                  className="h-24 w-32 object-contain rounded overflow-hidden shadow-xl"
                />
                <div className="flex justify-between w-full">
                  <div className="flex flex-col justify-center ml-2">
                    <label className="text-xs text-slate-500 leading-3">
                      Name
                    </label>
                    <label className="text-base text-slate-900 text-ellipsis w-1/2 leading-4">
                      {i.name}
                    </label>
                    <label className="text-xs text-slate-500 leading-3 mt-2">
                      Description
                    </label>
                    <label className="text-base text-slate-900 text-ellipsis w-3/4 leading-4">
                      {i.description}
                    </label>
                    <div className="flex mt-2">
                      <div className="border rounded mr-2 text-base text-amber-400 px-2 py-1">
                        {`${i.score} Score`}
                      </div>
                      <div className="border rounded text-base text-amber-400 px-2 py-1">
                        {`${i.open_issues} Issues`}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-red-300 flex h-6 w-6 transition-all duration-500 ${
                      i.isExpand && "rotate-90"
                    }`}
                    onClick={() => onExpandRepo(i, k, arr)}
                  >
                    <IcLeftArrow />
                  </div>
                </div>
              </div>
              <div
                className={`${
                  i.isExpand ? "h-[860px]" : "h-0"
                } w-full transition-all duration-500 overflow-hidden`}
              >
                {/* {i.isExpand && <CustomChart />} */}
                <Dropdown
                  items={JSON.parse(JSON.stringify(dropdownOptions))}
                  value={selected}
                  onChange={(e: SetStateAction<{ name: string }>) => {
                    e.name === "Commits"
                      ? onSetChartCommits(stringValue)
                      : onSetChartRepoName(stringValue);
                    setSelected(e);
                  }}
                  showValue={selected.name}
                  title={undefined}
                />
                <div className="h-full w-full">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                  />
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={chartContributeOptions}
                  />
                </div>
              </div>
            </div>
          );
        }
      )}
      {repoData.length > 0 && incompleteResults && (
        <div
          onClick={onLoadMore}
          className={`bg-red-600 text-base font-bold text-white p-5 text-center rounded`}
        >
          Load More
        </div>
      )}
    </div>
  );
}

export default App;
