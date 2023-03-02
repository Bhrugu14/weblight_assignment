import axios from "axios";

export const getRepoAdditionDeletion = async (string: string) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${string}/stats/code_frequency`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getRepoCommits = async (string: string) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${string}/stats/commit_activity`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const getRepoContributes = async (string: string) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${string}/commits`
    );
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
