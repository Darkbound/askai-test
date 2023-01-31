import axios from "axios";

export const inferenceRunnerAxios = axios.create({
  headers: {
    "X-API-Key": process.env.INFERENCE_RUNNER_API_KEY
  },
  baseURL: process.env.INFERENCE_RUNNER_BASE_URL
});

export const chunkHolderAxios = axios.create({
  headers: {
    "X-API-Key": process.env.CHUNK_HOLDER_API_KEY
  },
  baseURL: process.env.CHUNK_HOLDER_BASE_URL
});
