function send(setUrl, postData, doSuccess, doFail, doComplete, methods) {
  wx.showLoading({
    title: '加载中，请稍后',
    mask: true
  })
  wx.request({
    url: setUrl,
    data: postData,
    method: methods || 'GET',
    header: {
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (typeof doSuccess == "function") {
        doSuccess(res);
      }
    },
    fail: function () {
      setTimeout(function () {
        wx.showToast({
          title: `网络异常,\r\n请检查网络是否正常连接`,
          icon: 'none'
        })
      }, 1000)
      if (typeof doFail == "function") {
        doFail();
      }
    },
    complete: function () {
      if (typeof doComplete == "function") {
        doComplete();
      }
      setTimeout(function () {
        wx.hideLoading();
      }, 1500);
    }
  });
};
module.exports.send = send;