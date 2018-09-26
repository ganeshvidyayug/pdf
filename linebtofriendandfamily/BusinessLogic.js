import BOT from './utilities/Bot'

export default {
  friendAndFamily: async function (req, query) {
    try {
      await BOT.AccountInit(req)

      if (await BOT.IsVerifyStatusY(req)) {
        await BOT.Says([BOT.MESSAGE.sayCustomerCompleteForm], req.source.userId)
        return { status: 200 }
      }
      if (await BOT.IsCustomerCompleteForm(req.source.userId)) {
        await BOT.SaveCustomerSaid(req)
        await BOT.Says([BOT.MESSAGE.sayCustomerCompleteForm], req.source.userId)
        return { status: 200 }
      }
      if (req.type === 'follow') {
        await BOT.Says([BOT.MESSAGE.welcome, BOT.MESSAGE.askAdvMobileNo], req.source.userId)
        return { status: 200 }
      }
      if (req.type === 'unfollow') {
        return { status: 200 }
      }

      switch (req.message.type) {
        case 'text':
          await BOT.SaveCustomerSaid(req)
          let _statusTextLogic = await textMassageLogic(req)
          return _statusTextLogic
        default:
          return { status: 200 }
      }
    } catch (err) {
      await BOT.CrateErrorLog(req.source.userId, err.message)
      return { status: 500, message: err.message }
    }
  }
}

let textMassageLogic = async function (req) {
  let _userId = req.source.userId
  let _messageTxt = req.message.text
  let _lastResponse = await BOT.LastResponse(req)
  if (!_lastResponse || BOT.verify.isGreeting(_messageTxt)) {
    await BOT.Says([BOT.MESSAGE.welcome, BOT.MESSAGE.askAdvMobileNo], req.source.userId)
    return { status: 200 }
  }

  switch (_lastResponse) {
    case BOT.MESSAGE.askAdvMobileNo:
    case BOT.MESSAGE.askAdvMobileNoAgain:
      if ((BOT.verify.isMobileNo(_messageTxt) || BOT.verify.isHomeNo(_messageTxt))) {
        if (await BOT.CheckHasAdvMobileInSystem(_messageTxt)) {
          await BOT.UpdateDataFFPromo({mobile_adv: _messageTxt, lineuserid: _userId})
          await BOT.Says([BOT.MESSAGE.askCustomerMobileNo], _userId)
        } else {
          await BOT.Says([BOT.MESSAGE.sayNoAdvMobileNoInSystem, BOT.MESSAGE.askAdvMobileNoAgain], req.source.userId)
        }
      } else {
        await BOT.Says([BOT.MESSAGE.sayMobileNoFormatWrong, BOT.MESSAGE.askAdvMobileNoAgain], req.source.userId)
      }
      break
    case BOT.MESSAGE.askCustomerMobileNo:
    case BOT.MESSAGE.askCustomerMobileNoAgain:
      let IsAdvMobileSameCustomerMobile = await BOT.IsCustomerMobileLikeAdvMobile(_messageTxt, _userId)
      if (BOT.verify.isMobileNo(_messageTxt) && !IsAdvMobileSameCustomerMobile) {
        await BOT.UpdateDataFFPromo({ mobile: _messageTxt, lineuserid: _userId })
        await BOT.Says([BOT.MESSAGE.askCarDetail], _userId)
      } else {
        if (IsAdvMobileSameCustomerMobile) {
          await BOT.Says([BOT.MESSAGE.sayAdvNoSameCustomerNo, BOT.MESSAGE.askAdvMobileNoAgain], req.source.userId)
        } else {
          await BOT.Says([BOT.MESSAGE.sayMobileNoFormatWrong, BOT.MESSAGE.askCustomerMobileNoAgain], req.source.userId)
        }
      }
      break
    case BOT.MESSAGE.askCarDetail:
      await BOT.UpdateDataFFPromo({ car_detail: _messageTxt, lineuserid: _userId, is_complete: 'Y' })
      await BOT.Says([BOT.MESSAGE.sayThk], _userId)
      break
    default:
      await BOT.Says([BOT.MESSAGE.notUnderstand], _userId)
      break
  }
  return { status: 200 }
}
