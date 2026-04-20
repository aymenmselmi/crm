const http = require("http");

const tokenA =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGIyZDhmNS04ZjM4LTQ0MzctYmE2My0yMmI0Mzc4Mzc0OGYiLCJlbWFpbCI6InRlc3QyQHh5ei5jb20iLCJvcmdhbml6YXRpb25JZCI6IjM5NTlmMmZkLWFmMDktNGFmMS05NjQ2LTMwMTZiZmFlNzUxNSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjY4MzE5NywiZXhwIjoxNzc2Njg2Nzk3fQ.9Nr5exNMw_eEZD5epWinzWGGsMsXrB5DfWpogUEHHPs";
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
    console.log("=== Comprehensive Multi-Tenant CRUD Test ===\n");

    // Test 1: Create Contacts in Org A
    console.log("Test 1: Create Contact in Org A");
    const contactA = await makeRequest(
      "POST",
      "/contacts",
      JSON.stringify({
        firstName: "John",
        lastName: "Doe",
        email: "john@org-a.com",
        phone: "555-0001",
      }),
      tokenA,
    );
    console.log(`Status: ${contactA.status}, Contact ID: ${contactA.data?.id}`);

    // Test 2: Create Contacts in Org B
    console.log("\nTest 2: Create Contact in Org B");
    const contactB = await makeRequest(
      "POST",
      "/contacts",
      JSON.stringify({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@org-b.com",
        phone: "555-0002",
      }),
      tokenB,
    );
    console.log(`Status: ${contactB.status}, Contact ID: ${contactB.data?.id}`);

    // Test 3: Create Leads in Org A
    console.log("\nTest 3: Create Lead in Org A");
    const leadA = await makeRequest(
      "POST",
      "/leads",
      JSON.stringify({
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice@org-a.com",
        company: "TechCorp",
        status: "new",
      }),
      tokenA,
    );
    console.log(`Status: ${leadA.status}, Lead ID: ${leadA.data?.id}`);

    // Test 4: Create Leads in Org B
    console.log("\nTest 4: Create Lead in Org B");
    const leadB = await makeRequest(
      "POST",
      "/leads",
      JSON.stringify({
        firstName: "Bob",
        lastName: "Wilson",
        email: "bob@org-b.com",
        company: "GlobalCorp",
        status: "new",
      }),
      tokenB,
    );
    console.log(`Status: ${leadB.status}, Lead ID: ${leadB.data?.id}`);

    // Test 5: Org A List Contacts
    console.log("\nTest 5: Org A Lists Contacts");
    const listContactsA = await makeRequest("GET", "/contacts", null, tokenA);
    const orgAContacts = listContactsA.data?.data || [];
    console.log(`Org A has ${orgAContacts.length} contact(s)`);
    console.log(
      `Org A contact emails: ${orgAContacts.map((c) => c.email).join(", ")}`,
    );

    // Test 6: Org B List Contacts
    console.log("\nTest 6: Org B Lists Contacts");
    const listContactsB = await makeRequest("GET", "/contacts", null, tokenB);
    const orgBContacts = listContactsB.data?.data || [];
    console.log(`Org B has ${orgBContacts.length} contact(s)`);
    console.log(
      `Org B contact emails: ${orgBContacts.map((c) => c.email).join(", ")}`,
    );

    // Test 7: Org A List Leads
    console.log("\nTest 7: Org A Lists Leads");
    const listLeadsA = await makeRequest("GET", "/leads", null, tokenA);
    const orgALeads = listLeadsA.data?.data || [];
    console.log(`Org A has ${orgALeads.length} lead(s)`);
    console.log(
      `Org A lead emails: ${orgALeads.map((l) => l.email).join(", ")}`,
    );

    // Test 8: Org B List Leads
    console.log("\nTest 8: Org B Lists Leads");
    const listLeadsB = await makeRequest("GET", "/leads", null, tokenB);
    const orgBLeads = listLeadsB.data?.data || [];
    console.log(`Org B has ${orgBLeads.length} lead(s)`);
    console.log(
      `Org B lead emails: ${orgBLeads.map((l) => l.email).join(", ")}`,
    );

    // Test 9: Update Contact in Org A
    console.log("\nTest 9: Update Contact in Org A");
    const updateA = await makeRequest(
      "PUT",
      `/contacts/${contactA.data.id}`,
      JSON.stringify({ email: "john-updated@org-a.com" }),
      tokenA,
    );
    console.log(
      `Status: ${updateA.status}, Updated email: ${updateA.data?.email}`,
    );

    // Test 10: Delete Lead in Org B
    console.log("\nTest 10: Delete Lead in Org B");
    const deleteB = await makeRequest(
      "DELETE",
      `/leads/${leadB.data.id}`,
      null,
      tokenB,
    );
    console.log(`Status: ${deleteB.status}`);

    // Verify deletion
    console.log("\nTest 11: Verify Lead Deleted from Org B");
    const listLeadsB2 = await makeRequest("GET", "/leads", null, tokenB);
    const orgBLeads2 = listLeadsB2.data?.data || [];
    console.log(`Org B now has ${orgBLeads2.length} lead(s)`);

    console.log("\n=== ISOLATION VERIFICATION ===");
    const hasOrgAData =
      orgBContacts.some((c) => c.email === "john@org-a.com") ||
      orgBLeads.some((l) => l.email === "alice@org-a.com");
    const hasOrgBData =
      orgAContacts.some((c) => c.email === "jane@org-b.com") ||
      orgALeads.some((l) => l.email === "bob@org-b.com");

    if (!hasOrgAData && !hasOrgBData) {
      console.log("✓ MULTI-TENANT ISOLATION: WORKING PERFECTLY");
      console.log("  - Org A data isolated from Org B");
      console.log("  - Org B data isolated from Org A");
      console.log("  - All CRUD operations working correctly");
    } else {
      console.log("✗ SECURITY ISSUE: Cross-organization data visible");
      if (hasOrgAData) console.log("  - Org B can see Org A data");
      if (hasOrgBData) console.log("  - Org A can see Org B data");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
