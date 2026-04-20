const { DataSource } = require("typeorm");

const dataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "0000",
  database: "crm_dev",
  logging: true,
});

dataSource
  .initialize()
  .then(async () => {
    console.log("✓ Database connection successful");

    // Check if tables exist
    const tables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log("Tables in database:", tables);

    // Check organizations
    const orgs = await dataSource.query("SELECT * FROM organizations");
    console.log("Organizations:", orgs);

    // Check global users
    const users = await dataSource.query("SELECT * FROM global_users");
    console.log("Global Users:", users);

    // Check accounts
    const accounts = await dataSource.query("SELECT * FROM accounts");
    console.log("Accounts:", accounts);

    process.exit(0);
  })
  .catch((error) => {
    console.error("✗ Database connection failed:", error.message);
    process.exit(1);
  });
