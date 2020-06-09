let disp = require("../../../utils/huanxinIM/broadcast");

Page({
	data: {
		username: {
			your: "",
		},
	},

	// options = 系统传入的 url 参数
	onLoad(options){
		let username = JSON.parse(options.username);
		console.log(options,"这个是在chatroom里的");
		this.setData({ username: username });
		wx.setNavigationBarTitle({
			title: username.your
		});
	},

	onUnload(){
		disp.fire("em.chatroom.leave");
	},

	onPullDownRefresh: function () {
	  	wx.showNavigationBarLoading();
	    this.selectComponent('#chat').getMore()
	    // 停止下拉动作
	    wx.hideNavigationBarLoading();
	    wx.stopPullDownRefresh();
  	},

});
