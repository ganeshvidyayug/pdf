import pushMessage from './PushMessage'
import db from './../Database'
export default {
  RegisterFriendAndFamilyPromo: async function (req, asaID) {
    let _result = await db.InsertFriendAndFamilyPromo({ asa_id: asaID, lineuserid: req.source.userId })
    return _result
  },
  LastResponse: async function (req) {
    let _accountID = await this.GetAccountID(req.source.userId)
    let _lastResponse = await db.GetLastResponse(_accountID)
    return _lastResponse
  },
  SayWelcomeAndAskAdvMobileNo: async function (req) {
    let _asaID = await this.GetAccountID(req.source.userId)
    let _pushMsg1 = await pushMessage.TextMessage(this.CreateMessage(req.source.userId, this.MESSAGE.welcome))
    if (_pushMsg1.status === 200) {
      await db.InsertLogResponse({ lsar_asa_id: _asaID, lineuserid: req.source.userId, response: this.MESSAGE.welcome, resposne_type: 'text' })
      await this.SendLine(req.source.userId, this.MESSAGE.askAdvMobileNo)
    }
  },
  Says: async function (msgs, userId) {
    let _sendStatus = await this.SendLines(userId, msgs)
    return _sendStatus
  },
  SendLines: async function (uid, msgs) {
    let _asaID = await this.GetAccountID(uid)
    let _pushMsg = await pushMessage.TextMessage(this.CreateMessages(uid, msgs))
    if (_pushMsg.status === 200) {
      for (let i = 0; i < msgs.length; i++) {
        await db.InsertLogResponse({ lsar_asa_id: _asaID, lineuserid: uid, response: msgs[i], resposne_type: 'text' })
      }
    } else {
      for (let i = 0; i < msgs.length; i++) {
        await db.InsertLogResponse({ lsar_asa_id: _asaID, lineuserid: uid, response: `${db.MessageStatus.SendLineFailed} : ${msgs[i]}`, resposne_type: 'text' })
      }
    }
    return _pushMsg.status
  },
  AccountInit: async function (req) {
    let _account = await db.GetAccountByUserId(req.source.userId)
    let _that = this
    if (_account.result.rowsAffected[0] <= 0) {
      let _profile = await pushMessage.GetProfile(req.source.userId)
      let _res = await db.InsertAccountLine({lineUserId: req.source.userId, linedDisplay: _profile.body.displayName})
      await _that.RegisterFriendAndFamilyPromo(req, _res.result.recordset[0].asa_id)
    }
  },
  IsVerifyStatusY: async function (req) {
    let _account = await db.GetAccountByUserId(req.source.userId)
    let _VStatusRes = await db.GetVerifyStatus(_account.result.recordset[0].asa_id)
    if (_VStatusRes.result.recordsets.length > 0) {
      if (_VStatusRes.result.recordset[0].verify_status === 'Y') {
        return true
      }
    }
    return null
  },
  IsCustomerCompleteForm: async function (userId) {
    let _account = await db.GetAccountByUserId(userId)
    let _VStatusRes = await db.GetCustomerCompleteStatus(_account.result.recordset[0].asa_id)
    if (_account.result.rowsAffected[0] > 0) {
      if (_VStatusRes.result.recordset[0].is_complete === 'Y') {
        return true
      }
    }
    return false
  },
  SaveCustomerSaid: async function (req) {
    let _asaID = await this.GetAccountID(req.source.userId)
    let _text = req.message.text.replace(/'/g, '')
    await db.InsertLogResponse({ lsar_asa_id: _asaID, lineuserid: req.source.userId, response: _text, sent_type: req.message.type })
  },
  SaySticker: async function (req) {
    let _resualt = await pushMessage.StickerMessage(this.CreateSticker(req.source.userId, req.message))
    return _resualt
  },
  CheckHasAdvMobileInSystem: async function (mobileNo) {
    let _res = await db.GetAdvAccount(mobileNo)
    if (_res.result.recordsets.length > 0) {
      return true
    } else {
      return false
    }
  },
  IsCustomerMobileLikeAdvMobile: async function (mobileNo, userId) {
    let _asaID = await this.GetAccountID(userId)
    if (await db.IsCustomerMobileLikeAdvMobile(mobileNo, _asaID)) {
      return true
    }
    return false
  },
  UpdateDataFFPromo: async function (param) {
    param.asa_id = await this.GetAccountID(param.lineuserid)

    if (param.mobile_adv !== undefined) {
      let _res = await db.UpdateAdvMobileNoFFPromo(param)
      return _res
    } else if (param.mobile !== undefined) {
      let _res = await db.UpdateMobileNoFFPromo(param)
      return _res
    } else if (param.car_detail !== undefined) {
      param.car_detail = param.car_detail.replace(/'/g, '')
      let _res = await db.UpdateCarDetailFFPromo(param)
      return _res
    }
  },
  UpdateDataNoFFPromo: async function (param) {
    console.warn('UpdateDataNoFFPromo deprecated function!') // deprecated
    param.asa_id = await this.GetAccountID(param.lineuserid)

    if (param.mobile_adv !== undefined) {
      let _res = await db.UpdateAdvMobileNoFFPromo(param)
      return _res
    } else if (param.mobile !== undefined) {
      let _res = await db.UpdateMobileNoFFPromo(param)
      return _res
    } else if (param.year_car !== undefined) {
      let _res = await db.UpdateYearCarFFPromo(param)
      return _res
    } else if (param.brand !== undefined) {
      param.brand = param.brand.replace(/'/g, '')
      let _res = await db.UpdateBrandCarFFPromo(param)
      return _res
    }
  },
  NotUnderstand: async function (req) {
    let _res = await pushMessage.TextMessage(this.CreateMessage(req.source.userId, this.MESSAGE.notUnderstand))
    return _res
  },
  GetAccountID: async function (lineuserid) {
    let _accRes = await db.GetAccountByUserId(lineuserid)
    if (_accRes.result.rowsAffected[0] > 0) {
      return _accRes.result.recordset[0].asa_id
    }
    return null
  },
  CountSayNotUnderstand: async function (lineuserid) {
    let _asaID = await this.GetAccountID(lineuserid)
    if (_asaID) {
      let _cnt = await db.CountSayNotUnderstand(_asaID)
      return _cnt
    }
    return 0
  },
  CrateErrorLog: async function (uid, error) {
    let _asaID = await this.GetAccountID(uid)
    // await pushMessage.TextMessage(this.CreateMessage(uid, 'ว้าย API Error จ้า'))
    // console.log(error)
    await db.InsertLogResponse({ lsar_asa_id: _asaID, lineuserid: uid, response: `${db.MessageStatus.SystemErrorLog} : ${error.message}`, resposne_type: 'text' })
  },
  CreateMessage: function (uid, text) {
    let msg = {
      to: uid,
      messages: [{
        type: 'text',
        text: text
      }]
    }
    return msg
  },
  CreateMessages: function (uid, texts) {
    let _texts = []
    for (let i = 0; i < texts.length; i++) {
      _texts.push({
        type: 'text',
        text: texts[i]
      })
    }

    let _msgs = {
      to: uid,
      messages: _texts
    }
    return _msgs
  },
  verify: {
    isGreeting: function (str) {
      return str === 'สวัสดี' || str === 'เข้าร่วมโครงการ' || str.includes('สวัสดี') || str.includes('hello') || str.includes('Hello') || str.includes('ต้องทำอย่างไร') || str.includes('สมัคร') || str.includes('ทำไง')
    },
    isMobileNo: function (str) {
      let _regExp = /^0([1-9]{1})[0-9]{8}$/i
      return _regExp.test(str)
    },
    isHomeNo: function (str) {
      let _regExp = /^0[0-9]{8}$/i
      return _regExp.test(str)
    },
    isYearCar: function (str) {
      try {
        if (str.length === 4) {
          let _year = parseInt(str)
          if (_year >= 2000 && _year < 3000) {
            return true
          }
        }
      } catch (e) {}
      return false
    }
  },
  MESSAGE: {
    welcome: `ขอบคุณที่สนใจร่วมโครงการ Family & Friends \n คุณจะได้รับส่วนลดเบี้ยประกันจากส่วนลดปกติอีก 400บาท เมื่อกรอกข้อมูลรับสิทธิ์ และได้รับการติดต่อกลับยืนยันจากเจ้าหน้าที่ค่ะ`,
    askAdvMobileNo: `กรอกเบอร์มือถือผู้แนะนำโครงการนี้ให้คุณ`,
    askAdvMobileNoAgain: `กรุณา กรอกเบอร์มือถือผู้แนะนำโครงการนี้ให้คุณ`,
    askCustomerMobileNo: `เบอร์มือถือของคุณ(เพื่อใช้ยืนยันรับสิทธิ์)`,
    askCustomerMobileNoAgain: `กรุณา กรอกเบอร์มือถือของคุณ(เพื่อใช้ยืนยันรับสิทธิ์)`,
    askCarDetail: `ขอทราบข้อมูลรถ และเดือนหมดอายุประกันของคุณค่ะ (Toyota Vios 2015 หมด พย. )`,
    askCarBrand: `ยี่ห้อรถของคุณ`, // deprecated
    askCarBrandAgain: `กรุณา กรอกยี่ห้อรถของคุณ`, // deprecated
    askCarYear: `ปีรถ`, // deprecated
    askCarYearAgain: `กรุณา กรอกปีรถ`, // deprecated
    sayThk: `ขอบคุณค่ะ การลงทะเบียนสำเร็จแล้ว อีกสักครู่ เจ้าหน้าที่จะติดต่อกลับ เพื่อยืนยันรับสิทธิ์ ส่วนลด400บาท`,
    sayAdvNoSameCustomerNo: `ขออภัยค่ะ คุณไม่สามารถใช้หมายเลขผู้แนะนำ และหมายเลขของคุณเป็นเลขหมายเดียวกัน เราจะพาคุณกลับไปยังคำถามหมายเลขผู้แนะนำเพื่อให้คุณสามารถเปลี่ยน หมายเลขผู้แนะนำและทำตามขั้นตอนใหม่อีกครั้งค่ะ`,
    sayCustomerHasJoinPromotion: `ขออภัยค่ะ ท่านได้รับสิทธิ์ในโครงการนี้ไปแล้ว หากต้องการสอบถามเพิ่มเติมกรุณาโทร. 02-3925500 หรือแอดไลน์ Id: @silkspan`, // deprecated
    sayCustomerCompleteForm: `ขออภัยค่ะ คุณเคยเข้าร่วมโครงการ Family&Friends แล้ว ไม่สามารถทำรายการซ้ำได้ค่ะ`,
    sayNoAdvMobileNoInSystem: `ขออภัยค่ะ ไม่พบหมายเลขนี้ในระบบค่ะ`,
    sayYearFormatWrong: `ขออภัยค่ะ รูปแบบของปีไม่ถูกต้องค่ะ`, // deprecated
    sayMobileNoFormatWrong: `ขออภัยค่ะ รูปแบบของ เบอร์โทรไม่ถูกต้องค่ะ`,
    notUnderstand: 'ขออภัยค่ะ ระบบอัตโนมัติไม่สามารถตอบกลับได้ หากต้องการสอบถามเพิ่มเติมกรุณาโทร. 02-3925500 หรือแอดไลน์ Id: @silkspan',
    startAgain: 'หากต้องการเริ่มต้นขั้นตอนการกรอกข้อมูลอีกครั้ง กรุณาพิมพ์ สมัครร่วมโครงการ', // deprecated
    sayGoodbye: `ขอบคุณที่ใช้บริการ หวังว่าลูกค้าจะได้รับควาประทับใจในการให้บริการของเรานะคะ` // deprecated
  }
}
