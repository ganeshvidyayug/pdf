export default {
  responseToClient: function Response ({res, httpcode, data, msgerror, isJsondata = false}) {
    let reData = {}
    if (httpcode === '200' && isJsondata === false) {
      reData.Status = {httpmessage: 'success', data: data, code: '200'}
      res.status(200)
      res.send(reData)
    } else if (httpcode === 200 && isJsondata === true) {
      res.status(200)
      res.json(data)
    } else if (httpcode === '401') {
      reData.Status = {httpmessage: 'unauthorized', message: msgerror, code: '401'}
      res.status(401)
      res.send(reData)
    } else if (httpcode === '403') {
      reData.Status = {httpmessage: 'forbidden', message: msgerror, code: '403'}
      res.status(403)
      res.send(reData)
    } else if (httpcode === '404') {
      reData.Status = {httpmessage: 'notfound', message: msgerror, code: '404'}
      res.status(404)
      res.send(reData)
    } else if (httpcode === '400') {
      reData.Status = {httpmessage: 'badrequest', message: msgerror, code: '400'}
      res.status(400)
      res.send(reData)
    } else if (httpcode === '500') {
      reData.Status = {httpmessage: 'internaserver error', message: msgerror, code: '500'}
      res.status(500)
      res.send(reData)
    } else if (httpcode === '201') {
      reData.Status = {httpmessage: 'create success', data: data, code: '201'}
      res.status(201)
      res.send(reData)
    }
  },
  setDefaultParam: function setDefaultPrm (_param) {
    if (_param === undefined) {
      return null
    } else if (_param === null || _param === 'NULL') {
      return null
    } else {
      return `'${_param}'`
    }
  }
}
