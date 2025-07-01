export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  mysqlUrl: process.env.MYSQL_PUBLIC_URL,
  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
});