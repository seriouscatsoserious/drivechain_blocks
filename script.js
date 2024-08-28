function showError(message) {
  console.error("Showing error:", message);
  const dataDisplay = document.getElementById("dataDisplay");
  if (dataDisplay) {
    dataDisplay.innerHTML = `<p class="error-message">${message}</p>`;
  } else {
    console.error("dataDisplay element not found in showError");
  }
}

function parseAndDisplayData(contents) {
  console.log("Parsing and displaying data");
  const dataDisplay = document.getElementById("dataDisplay");
  if (!dataDisplay) {
    console.error("dataDisplay element not found in parseAndDisplayData");
    return;
  }

  try {
    let html = "<table><tr><th>Chain</th><th>Height</th></tr>";

    // Parse block heights, showing all chains
    const heightRegex = /(\w+)\sheight<br>\s*(\d*)/g;
    let match;
    while ((match = heightRegex.exec(contents)) !== null) {
      const chain = match[1];
      const height =
        match[2] || '<span class="no-blocks">No blocks detected</span>';
      html += `<tr><td>${chain}</td><td>${height}</td></tr>`;
    }
    html += "</table>";

    // Parse blockchain info and mining info
    const infoRegex = /<code>\s*(\{[\s\S]*?\})\s*<\/code>/g;
    let infoMatch;
    let difficulty, networkHashps;

    while ((infoMatch = infoRegex.exec(contents)) !== null) {
      const info = JSON.parse(infoMatch[1]);
      if ("difficulty" in info) difficulty = info.difficulty;
      if ("networkhashps" in info) networkHashps = info.networkhashps;
    }

    if (difficulty)
      html += `<div class="network-info"><h2>Mining Difficulty</h2><p>${difficulty.toExponential(
        4
      )}</p></div>`;
    if (networkHashps)
      html += `<div class="network-info"><h2>Network Hashrate</h2><p>${(
        networkHashps * 1000
      ).toFixed(2)} mH/s</p></div>`;

    dataDisplay.innerHTML = html;
    console.log("Data display updated successfully");
  } catch (error) {
    console.error("Error parsing data:", error);
    showError(`Failed to parse data: ${error.message}`);
  }
}

function fetchData() {
  console.log("Fetching data...");
  const proxyUrl = "https://throbbing-rain-bdd7.alicexbt.workers.dev/?url=";
  const targetUrl = "http://172.105.148.135/";
  const urlWithCacheBuster =
    proxyUrl + encodeURIComponent(targetUrl + "?t=" + new Date().getTime());

  fetch(urlWithCacheBuster)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data);
      if (data && typeof data === "object" && "contents" in data) {
        parseAndDisplayData(data.contents);
      } else {
        throw new Error("Received data is not in the expected format");
      }
    })
    .catch((error) => {
      console.error("Error fetching or parsing data:", error);
      showError(`Failed to fetch or parse data: ${error.message}`);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM fully loaded and parsed");
  const dataDisplay = document.getElementById("dataDisplay");
  if (!dataDisplay) {
    console.error("dataDisplay element not found");
    return;
  }

  dataDisplay.innerHTML = "<p>Data loading...</p>";
  fetchData();
});
