import sql from "mssql";

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "BTL_DB",
    server: process.env.DB_SERVER,
    port: process.env.DB_PORT,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectionTimeout: 30000,
    },
};

const connectDB = async () => {
    try {
        await sql.connect(sqlConfig);
        console.log("✅ Microsoft SQL server connected");
        let a = await sql.query("SELECT * FROM [USER]")
        console.log(a);
    } catch (error) {
        console.error("❌ Microsoft SQL server connection failed:", error);
        await connectDB();
    }
};

export default { connectDB };
