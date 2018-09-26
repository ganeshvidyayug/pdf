
import config from './../config/config.js'
const request = require('request')

export default {
  TextMessage: async function (body) {
    return new Promise(function (resolve, reject) {
      request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + config.lineApi.token
        },
        url: config.lineApi.url,
        method: 'POST',
        body: body,
        json: true
      }, function (err, response, body) {
        if (err) {
          resolve({ status: 302 })
        } else {
          resolve({ status: 200 })
        }
      })
    })
  },
  StickerMessage: async function (body) {
    try {
      await request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + config.lineApi.token
        },
        url: config.lineApi.url,
        method: 'POST',
        body: body,
        json: true
      })
      return { status: 200 }
    } catch (err) {
      return { status: 302, message: err.message }
    }
  },
  GetProfile: async function (uid) {
    return new Promise(function (resolve, reject) {
      request({
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + config.lineApi.token
        },
        url: 'https://api.line.me/v2/bot/profile/' + uid,
        method: 'GET',
        body: {},
        json: true
      }, function (err, response, body) {
        if (err) {
          resolve(err)
        } else {
          resolve(response)
        }
      })
    })
  }
}
