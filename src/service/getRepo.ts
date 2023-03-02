import axios from "axios";

export const getRepo = async (arg) => {
  try {
    const d = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
    const dt = `${d.getFullYear()}-${
      d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
    }-${d.getDate()}`;
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=created:>${dt}&sort=stars&order=desc`
    );

    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
