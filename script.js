document.addEventListener("DOMContentLoaded", function () {
  const dataDisplay = document.getElementById("dataDisplay");
  dataDisplay.innerHTML = `
      <table>
          <tr><th>Chain</th><th>Height</th></tr>
          <tr><td colspan="2">Loading...</td></tr>
      </table>
  `;
  fetchData();
});

function fetchData() {
  const proxyUrl = "https://throbbing-rain-bdd7.alicexbt.workers.dev/?url=";
  const targetUrl = "http://172.105.148.135/";
  const urlWithCacheBuster =
    proxyUrl + encodeURIComponent(targetUrl + "?t=" + new Date().getTime());

  fetch(urlWithCacheBuster)
    .then((response) => response.json())
    .then((data) => {
      parseData(data.contents);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      showError("Failed to fetch data. Try refreshing the page.");
    });
}

function parseData(htmlContent) {
  const dataDisplay = document.getElementById("dataDisplay");
  const lines = htmlContent
    .split("<br><br>")
    .filter((line) => line.trim() !== "");
  let displayHtml = "<table><tr><th>Chain</th><th>Height</th></tr>";

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split("<br>");
    if (parts.length >= 1) {
      const chainName = parts[0].replace("height", "").trim();
      const height = parts[1] ? parts[1].trim() : "";

      displayHtml += `<tr>
              <td>${chainName}</td>
              <td>${
                height
                  ? height
                  : '<span class="no-blocks">No blocks detected</span>'
              }</td>
          </tr>`;
    }
  }

  displayHtml += "</table>";
  dataDisplay.innerHTML = displayHtml;
}

function showError(message) {
  const dataDisplay = document.getElementById("dataDisplay");
  dataDisplay.innerHTML = `<p class="error-message">${message}</p>`;
}
