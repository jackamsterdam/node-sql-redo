class Config {

}

class DevelopmentConfig extends Config {
  isDevelopment = true
  logFile = './logs/logger.log'
  mysql = { host: 'localhost' ,user: 'root', password: '', database: 'Northwind'}
}

class ProductionConfig extends Config {
  isDevelopment = false
  logFile = './logs/logger.log'

   //! change with heroku:
    mysql = { host: 'localhost', user: 'root', password: '', database: 'Northwind'}
}

const config = process.env.NODE_ENV === 'production' ? new ProductionConfig() : new DevelopmentConfig()

export default config
