const axios = require("axios");

const API_BASE_URL = "http://challenge.z2o.cloud/challenges";
const NICKNAME = "your_nickname"; // ランキング用のニックネームを指定

async function startChallenge() {
  try {
    // 1. チャレンジを開始
    const response = await axios.post(`${API_BASE_URL}?nickname=${NICKNAME}`);
    const { id, actives_at } = response.data;
    console.log(`Challenge started! ID: ${id}`);

    // 2. 呼出の実行
    await executeCalls(id, actives_at);
  } catch (error) {
    console.error(
      "Error starting challenge:",
      error.response?.data || error.message
    );
  }
}

async function executeCalls(challengeId, activesAt) {
  let expectedTime = activesAt; // 次の呼出予定時間

  while (true) {
    const now = Date.now();
    let delay = expectedTime - now;

    if (delay > 0) {
      console.log(`Waiting ${delay}ms for the next call...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const start = Date.now(); // 実際のリクエスト開始時刻

    try {
      // 3. 呼出の実行
      const response = await axios.put(
        API_BASE_URL,
        {},
        {
          headers: { "X-Challenge-Id": challengeId },
        }
      );

      const { actives_at, total_diff, result } = response.data;
      console.log(`Call successful! Total diff: ${total_diff}ms`);

      if (result) {
        console.log(
          `Challenge completed! Attempts: ${result.attempts}, URL: ${result.url}`
        );
        break;
      }

      // 次の呼出予定時間を設定
      expectedTime = actives_at;

      // ✅ 誤差補正: 前回の遅延を考慮して、より正確なタイミングでリクエスト
      let executionTime = Date.now() - start; // 実際のリクエスト処理時間
      expectedTime += executionTime; // 遅延を補正
    } catch (error) {
      console.error(
        "Error making call:",
        error.response?.data || error.message
      );
      break;
    }
  }
}

startChallenge();
