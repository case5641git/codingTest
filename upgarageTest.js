const axios = require("axios");

const API_BASE_URL = ""; // /challengesまでのURLを設定
const NICKNAME = "htanaka";

const startChallenge = async () => {
  try {
    const res = await axios.post(`${API_BASE_URL}?nickname=${NICKNAME}`);
    const { id, actives_at } = res.data;
    console.log(`Challenge started: ${id}`);
    await executeCalls(id, actives_at);
  } catch (error) {
    console.error(error);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const executeCalls = async (challengeId, activesAt) => {
  let expectedTime = activesAt;
  while (true) {
    const now = Date.now();
    let delay = expectedTime - now;

    if (delay > 0) {
      console.log(`Waiting for ${delay}ms`);
      await sleep(delay);
    }

    const startTime = Date.now();
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
        console.log(
          `Challenge completed: Attempts: ${result.attempts}, URL: ${result.url}`
        );
        break;
      }

      // 誤差補正: リクエストにかかった時間を考慮
      expectedTime = actives_at + (Date.now() - startTime);
    } catch (error) {
      console.error(`Error making call: ${error.message}`);
      break;
    }
  }
};

startChallenge();
