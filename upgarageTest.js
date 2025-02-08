const axios = require("axios");

const API_BASE_URL = "http://challenge.z2o.cloud/challenges";
const NICKNAME = "htanaka";

const startChallenge = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}?nickname=${NICKNAME}`);
    const { id, actives_at } = res.data;
    console.log(`Challenge started: ${id}`);
    await excuteCalls(id, actives_at);
  } catch (error) {
    console.error(error);
  }
};

const excuteCalls = async (challengeId, activesAt) => {
  while (true) {
    const now = Date.now();
    const delay = activesAt - now;

    if (delay > 0) {
      console.log(`Waiting for ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    try {
      const res = await axios.put(
        API_BASE_URL,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "x-challenge-id": challengeId,
          },
        }
      );
      const { actives_at, total_diff, result } = res.data;
      console.log(`Total diff: ${total_diff}`);

      if (result) {
        console.log(`Challenge completed: ${result}, URL: ${result.url}`);
        break;
      }
      activesAt = actives_at;
    } catch (error) {
      console.error(`Error making call: ${error.message}`);
      break;
    }
  }
};
startChallenge();
