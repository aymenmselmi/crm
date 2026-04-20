const http = require("http");

const tokenA =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGIyZDhmNS04ZjM4LTQ0MzctYmE2My0yMmI0Mzc4Mzc0OGYiLCJlbWFpbCI6InRlc3QyQHh5ei5jb20iLCJvcmdhbml6YXRpb25JZCI6IjM5NTlmMmZkLWFmMDktNGFmMS05NjQ2LTMwMTZiZmFlNzUxNSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjY4MzE5NywiZXhwIjoxNzc2Njg2Nzk3fQ.9Nr5exNMw_eEZD5epWinzWGGsMsXrB5DfWpogUEHHPs";

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/accounts",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${tokenA}`,
  },
};

const body = JSON.stringify({ name: "Test Account", type: "prospect" });

const req = http.request(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Headers:", JSON.stringify(res.headers, null, 2));
    console.log("Response:", data);
  });
});

req.on("error", (err) => {
  console.error("Request error:", err);
});

console.log("Sending request...");
req.write(body);
req.end();
