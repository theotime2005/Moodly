module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost', // 'localhost' ou '127.0.0.1' si tu te connectes depuis Windows
      port: 5432,
      user: 'postgres',
      password: 'postgres',
      database: 'moodly_db'
    },
    migrations: {
      directory: './migrations'
    }
  }
};
