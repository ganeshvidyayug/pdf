import utility from './utilities/utilities.js'
import bill from './BusinessLogic.js'

exports.LineWebHook = async function (req, res) {
  // Webhook URL Verify From developers.line.me Channel settings
  if (req.body.events[0].replyToken === '00000000000000000000000000000000') {
    utility.responseToClient({ res: res, httpcode: '200' })
    return null
  }

  let _result = await bill.friendAndFamily(req.body.events[0], req.query)

  switch (_result.status) {
    case 200:
      utility.responseToClient({ res: res, httpcode: '200' })
      break
    case 400:
      utility.responseToClient({ res: res, httpcode: '400', msgerror: _result.message })
      break
    case 403:
      utility.responseToClient({ res: res, httpcode: '403', msgerror: _result.message })
      break
    default:
      utility.responseToClient({ res: res, httpcode: '500', msgerror: _result.message })
      break
  }
}
