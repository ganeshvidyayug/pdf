import gConfig from '../../../mssql-config.js'

const Settings = {
  production: {
    db: {
      SilkSpan: { Db: gConfig.conn30, Name: 'vmdbcenter.silkspan.dbo' },
      SilkSpan103: { Db: gConfig.conn103, Name: '[192.168.10.103].silkspan.dbo' }
    },
    lineApi: {
      url: 'https://api.line.me/v2/bot/message/push',
      token: '/**/<PRODUCTION TOKEN>/**/'
    }
  },
  dev: {
    db: {
      SilkSpan: { Db: gConfig.conn02, Name: 'Silkspan.dbo' },
      SilkSpan103: { Db: gConfig.conn02, Name: 'Silkspan.dbo' }
    },
    lineApi: {
      url: 'https://api.line.me/v2/bot/message/push',
      token: '+w0EzYuqPwqS4O/1Fm50nloHvLaljtQS3cUjBbWg9nYLjctCNbVwNkK4jlnXkERmxaDRqMUPV4nLEk0Aox83TB95F9wfe24wfe6zLYlwNqOtcfYxTZ5hkuCbjR+14NQK9NhrlMBEQcDubmR3IiHVXgdB04t89/1O/w1cDnyilFU='
    }
  }
}

export default (process.env.DB_HOST === 'production' ? Settings.production : Settings.dev)
