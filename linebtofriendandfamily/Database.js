import helper from './utilities/utilities'
import db from '../../mssql-config'
import config from './config/config'
import BOT from './utilities/Bot'

export default {
  GetAccountByUserId: async function (lineUserId) {
    var query = ` SELECT TOP(1) asa_id,lineuserid as LineUserID,bot_type,mobile
                  FROM account_sent_autoline
                  WHERE lineUserId = '${lineUserId}'; `
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  GetAdvAccount: async function (mobileNo) {
    var query = ` 
                  DECLARE @mobile varchar(50)
                  select  @mobile = [Silkspan].dbo.EncodingNop('${mobileNo}');
                  IF EXISTS (SELECT * FROM account_sent_autoline WHERE mobile=@mobile) begin
                  SELECT TOP(1) asa_id,lineuserid as LineUserID,bot_type,mobile
                  FROM account_sent_autoline
                  WHERE mobile = @mobile AND bot_type = 'SILKSPAN_SERVICE'; 
                  END`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  GetVerifyStatus: async function (asaID) {
    var query = ` 
                  IF EXISTS (SELECT * FROM friend_and_family_linepromo WHERE asa_id='${asaID}') BEGIN
                  SELECT TOP(1) verify_status
                  FROM friend_and_family_linepromo
                  WHERE asa_id = '${asaID}'; 
                  END`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  GetCustomerCompleteStatus: async function (asaID) {
    var query = ` 
                  SELECT TOP(1) is_complete
                  FROM friend_and_family_linepromo
                  WHERE asa_id = '${asaID}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  InsertAccountLine: async function (param) {
    var query = ` DECLARE @id bigint 
                  execute [silkspan].[dbo].[getmaxid] 1,'asa_id','account_sent_autoline',@id output
                  INSERT INTO [account_sent_autoline]
                          (
                            asa_id
                          ,[lineuserid]
                          ,[mobile]
                          ,[linedisplay]
                          ,[bot_type]
                          ,[createdate])
                    VALUES
                          (
                            @id
                          , ${helper.setDefaultParam(param.lineUserId, null)}
                          , null
                          , ${helper.setDefaultParam(param.linedDisplay, null)}
                          , 'FF'
                          , getdate());select @id as asa_id;`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  InsertLogResponse: async function (_param) {
    var query = ` DECLARE @id bigint 
                  execute [silkspan].[dbo].[getmaxid] 1,'lsar_id','log_sent_autoline_response',@id output
                  INSERT INTO [log_sent_autoline_response]
                          (
                           lsar_id
                          ,[lsar_asa_id]
                          ,[lineuserid]
                          ,[response]
                          ,[stickerId]
                          ,[packageId]
                          ,[fileName]
                          ,[fileSize]
                          ,[response_type]
                          ,[sent_type]
                          ,[response_date]
                          ,[is_bot_reply]
                          ,[bot_type])
                    VALUES
                          (
                            @id
                          , ${helper.setDefaultParam(_param.lsar_asa_id, null)}
                          , ${helper.setDefaultParam(_param.lineuserid, null)}
                          , ${helper.setDefaultParam(_param.response, null)}
                          , ${helper.setDefaultParam(_param.stickerId, null)}
                          , ${helper.setDefaultParam(_param.packageId, null)}
                          , null
                          , null
                          , ${helper.setDefaultParam(_param.resposne_type, null)}
                          , ${helper.setDefaultParam(_param.sent_type, null)}
                          , getdate()
                          , null
                          , 'FF'); select @id as Id;`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  InsertFriendAndFamilyPromo1: async function (_param) {
    console.warn('InsertFriendAndFamilyPromo1 deprecated function!') // deprecated
    var query = ` IF NOT EXISTS (SELECT * FROM friend_and_family_linepromo WHERE asa_id=${helper.setDefaultParam(_param.asa_id, null)}) begin
                  DECLARE @id bigint 
                  execute [silkspan].[dbo].[getmaxid] 1,'id','friend_and_family_linepromo',@id output
                  INSERT INTO [friend_and_family_linepromo]
                          (
                            id
                          ,[asa_id]
                          ,[adv_asa_id]
                          ,[mobile]
                          ,[adv_mobile]
                          ,[year_car]
                          ,[brand]
                          ,[model]
                          ,[verify_status]
                          ,[verify_date]
                          ,[lineuserid]
                          ,[create_date]
                          ,[bot_type])
                    VALUES
                          (
                            @id
                          , ${helper.setDefaultParam(_param.asa_id, null)}
                          , ${helper.setDefaultParam(_param.adv_asa_id, null)}
                          , ${helper.setDefaultParam(_param.mobile, null)}
                          , ${helper.setDefaultParam(_param.adv_mobile, null)}
                          , ${helper.setDefaultParam(_param.year_car, null)}
                          , ${helper.setDefaultParam(_param.brand, null)}
                          , ${helper.setDefaultParam(_param.model, null)}
                          , ${helper.setDefaultParam(_param.verify_status, null)}
                          , ${helper.setDefaultParam(_param.verify_date, null)}
                          , ${helper.setDefaultParam(_param.lineuserid, null)}
                          , getdate()
                          , 'FF'); select @id as Id;
                  END`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  InsertFriendAndFamilyPromo: async function (_param) {
    var query = ` IF NOT EXISTS (SELECT * FROM friend_and_family_linepromo WHERE asa_id=${helper.setDefaultParam(_param.asa_id, null)}) begin
                  DECLARE @id bigint 
                  execute [silkspan].[dbo].[getmaxid] 1,'id','friend_and_family_linepromo',@id output
                  INSERT INTO [friend_and_family_linepromo]
                          (
                            id
                          ,[asa_id]
                          ,[adv_asa_id]
                          ,[mobile]
                          ,[car_detail]
                          ,[verify_status]
                          ,[verify_date]
                          ,[lineuserid]
                          ,[adv_mobile]
                          ,[adv_car_detail]
                          ,[adv_name]
                          ,[adv_bank_account]
                          ,[adv_bank_account_no]
                          ,[bot_type]
                          ,[create_date]
                          ,[transfer_status]
                          ,[is_complete])
                    VALUES
                          (
                            @id
                          , ${helper.setDefaultParam(_param.asa_id, null)}
                          , ${helper.setDefaultParam(_param.adv_asa_id, null)}
                          , ${helper.setDefaultParam(_param.mobile, null)}
                          , ${helper.setDefaultParam(_param.car_detail, null)}
                          , ${helper.setDefaultParam(_param.verify_status, null)}
                          , ${helper.setDefaultParam(_param.verify_date, null)}
                          , ${helper.setDefaultParam(_param.lineuserid, null)}
                          , ${helper.setDefaultParam(_param.adv_mobile, null)}
                          , ${helper.setDefaultParam(_param.adv_car_detail, null)}
                          , ${helper.setDefaultParam(_param.adv_name, null)}
                          , ${helper.setDefaultParam(_param.adv_bank_account, null)}
                          , ${helper.setDefaultParam(_param.adv_bank_account_no, null)}
                          , 'FF'
                          , getdate()
                          , ${helper.setDefaultParam(_param.transfer_status, null)}
                          , ${helper.setDefaultParam(_param.is_complete, null)}); select @id as Id;
                  END`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  UpdateAdvMobileNoFFPromo: async function (param) {
    let query = `  
                  DECLARE @advMobile varchar(50)
                  DECLARE @asa_id BIGINT
                  DECLARE @linedisplay nvarchar(200)
                  select  @advMobile = [Silkspan].dbo.EncodingNop('${param.mobile_adv}');

                  SELECT @asa_id = asa_id, @linedisplay = linedisplay
                  FROM account_sent_autoline
                  WHERE mobile = @advMobile AND bot_type = 'SILKSPAN_SERVICE'; 

                  UPDATE friend_and_family_linepromo 
                  SET adv_mobile=@advMobile, adv_asa_id=@asa_id, adv_name=@linedisplay
                  WHERE asa_id = '${param.asa_id}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  UpdateMobileNoFFPromo: async function (param) {
    let query = `  
                  DECLARE @mobile varchar(50)
                  select  @mobile = [Silkspan].dbo.EncodingNop('${param.mobile}');
                  
                  UPDATE account_sent_autoline 
                  SET mobile=@mobile
                  WHERE asa_id = '${param.asa_id}';

                  UPDATE friend_and_family_linepromo 
                  SET mobile=@mobile
                  WHERE asa_id = '${param.asa_id}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  UpdateCarDetailFFPromo: async function (param) {
    let query = `  
                  UPDATE friend_and_family_linepromo 
                  SET car_detail='${param.car_detail}', is_complete='${param.is_complete}'
                  WHERE asa_id = '${param.asa_id}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  UpdateBrandCarFFPromo: async function (param) {
    console.warn('UpdateBrandCarFFPromo deprecated function!') // deprecated
    let query = `  
                  UPDATE friend_and_family_linepromo 
                  SET brand='${param.brand}'
                  WHERE asa_id = '${param.asa_id}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  UpdateYearCarFFPromo: async function (param) {
    console.warn('UpdateYearCarFFPromo deprecated function!') // deprecated
    let query = `  
                  UPDATE friend_and_family_linepromo 
                  SET year_car='${param.year_car}', is_complete='${param.is_complete}'
                  WHERE asa_id = '${param.asa_id}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    return result
  },
  GetLastResponse: async function (accountID) {
    let query = ` SELECT top 1 * FROM log_sent_autoline_response 
                  WHERE response_type is not null AND response is not null 
                  AND response not like '%${this.MessageStatus.SystemErrorLog}%'
                  AND response not like '%${this.MessageStatus.SendLineFailed}%' 
                  AND response not like '%${BOT.MESSAGE.notUnderstand}%' 
                  AND response not like '%${BOT.MESSAGE.startAgain}%' 
                  AND lsar_asa_id = '${accountID}' 
                  ORDER BY response_date DESC`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    if (result.result.rowsAffected[0] > 0) {
      return result.result.recordset[0].response
    } else {
      return null
    }
  },
  CountSayNotUnderstand: async function (accountID) {
    let query = ` SELECT count(*) as cnt FROM log_sent_autoline_response 
                  WHERE response_type is not null
                  AND response like '%${BOT.MESSAGE.notUnderstand}%' 
                  AND lsar_asa_id = '${accountID}'`
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    if (result.result.rowsAffected[0] > 0) {
      return result.result.recordset[0].cnt
    } else {
      return 0
    }
  },
  IsCustomerMobileLikeAdvMobile: async function (mobileNo, accountID) {
    let query = ` 
                DECLARE @mobile varchar(50)
                SELECT  @mobile = [Silkspan].dbo.EncodingNop('${mobileNo}');
                IF EXISTS ( select * from friend_and_family_linepromo 
                where asa_id = ${accountID}
                and adv_mobile=@mobile) BEGIN
                  SELECT 'TRUE' as IsSameNumber
                END
                ELSE
                BEGIN
                  SELECT 'FALSE' as IsSameNumber
                END `
    let result = await db.executeQueryAsync(config.db.SilkSpan.Db, query)
    if (result.result.recordset[0].IsSameNumber === 'TRUE') {
      return true
    } else {
      return false
    }
  },
  MessageStatus: {
    SendLineFailed: `Failed can not Send`,
    SystemErrorLog: `System Error`
  }
}
