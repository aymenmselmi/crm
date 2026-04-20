const http = require("http");

// Org A Token
const tokenA =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGIyZDhmNS04ZjM4LTQ0MzctYmE2My0yMmI0Mzc4Mzc0OGYiLCJlbWFpbCI6InRlc3QyQHh5ei5jb20iLCJvcmdhbml6YXRpb25JZCI6IjM5NTlmMmZkLWFmMDktNGFmMS05NjQ2LTMwMTZiZmFlNzUxNSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjY4MzE5NywiZXhwIjoxNzc2Njg2Nzk3fQ.9Nr5exNMw_eEZD5epWinzWGGsMsXrB5DfWpogUEHHPs";

// Org B Token
const tokenB =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTM2N2IzZC00OTE0LTQwYmMtYjJkZS02ZmQwYThhMTBjNGQiLCJlbWFpbCI6ImNvbnRhY3RAZ2xvYmFsaW5jLmNvbSIsIm9yZ2FuaXphdGlvbklkIjoiYWFiN2M4MjktZTcxNS00MmNjLWIwNDYtN2Q2MjVmMDE3N2I3Iiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzc2NjgzMjU4LCJleHAiOjE3NzY2ODY4NTh9.e-bSmygvJcYL4MjCsohE5RuEoK9_e_Q-ovImLiaDeyI";

function makeRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3000,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        resolve({
          status: res.statusCode,
          data: data ? JSON.parse(data) : null,
        });
      });
    });

    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function test() {
  try {
    console.log("=== Test 1: Create Account in Org A ===");
    const accountA = await makeRequest(
      "POST",
      "/accounts",
      JSON.stringify({ name: "TechCorp", type: "prospect" }),
      tokenA,
    );
    console.log("Status:", accountA.status);
    console.log("Account A ID:", accountA.data?.id);
    const accountAId = accountA.data?.id;

    console.log("\n=== Test 2: Create Account in Org B ===");
    const accountB = await makeRequest(
      "POST",
      "/accounts",
      JSON.stringify({ name: "Global Inc", type: "customer" }),
      tokenB,
    );
    console.log("Status:", accountB.status);
    console.log("Account B ID:", accountB.data?.id);
    const accountBId = accountB.data?.id;

    console.log("\n=== Test 3: Org A Lists Accounts ===");
    const listA = await makeRequest("GET", "/accounts", null, tokenA);
    console.log("Org A sees", listA.data?.data?.length || 0, "account(s)");
    const orgAIds = listA.data?.data?.map((a) => a.id) || [];
    console.log(
      "Account A found in Org A list:",
      orgAIds.includes(accountAId) ? "YES (GOOD)" : "NO (BAD)",
    );
    console.log(
      "Account B found in Org A list:",
      orgAIds.includes(accountBId) ? "NO (SECURITY BREACH!)" : "YES (GOOD)",
    );

    console.log("\n=== Test 4: Org B Lists Accounts ===");
    const listB = await makeRequest("GET", "/accounts", null, tokenB);
    console.log("Org B sees", listB.data?.data?.length || 0, "account(s)");
    const orgBIds = listB.data?.data?.map((a) => a.id) || [];
    console.log(
      "Account B found in Org B list:",
      orgBIds.includes(accountBId) ? "YES (GOOD)" : "NO (BAD)",
    );
    console.log(
      "Account A found in Org B list:",
      orgBIds.includes(accountAId) ? "NO (SECURITY BREACH!)" : "YES (GOOD)",
    );

    console.log("\n=== SUMMARY ===");
    console.log(
      "Multi-tenant isolation:",
      !orgAIds.includes(accountBId) && !orgBIds.includes(accountAId)
        ? "WORKING"
        : "FAILED",
    );
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
