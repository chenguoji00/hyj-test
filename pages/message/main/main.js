let WebIM = require("../../../utils/huanxinIM/WebIM")["default"];
let disp = require("../../../utils/huanxinIM/broadcast");
const cng = require("../.././../utils/config")
let systemReady = false;
let canPullDownreffesh = true;
let oHeight = [];
const app = getApp();
Page({
	data: {
		url: '',
		search_btn: true,
		search_friend: false,
		show_mask: false,
		myName: "",
		member: [],
		messageNum: "", //加好友申请数
		unReadSpotNum: 0, //未读消息数
		unReadNoticeNum: 0, //加群通知数
		unReadTotalNotNum: 0, //总通知数：加好友申请数 + 加群通知数

		isActive: null,
		listMain: [],
		listTitles: [],
		fixedTitle: null,
		toView: 'inToView0',
		oHeight: [],
		scroolHeight: 0,
		show_clear: false,
		isHideLoadMore: true,
		load: false,
		tmId:'',
	},
	onHide(){
		console.log("页面隐藏时候触发");
		getApp().globalData.norefreshMessage = false;
	},

	onLoad(option) {
		console.log(option,"this is option");
		
		// const me = this;
		// new app.ToastPannel.ToastPannel();
		//监听加好友申请
		// disp.on("em.xmpp.subscribe", function () {
		// 	me.setData({
		// 		messageNum: getApp().globalData.saveFriendList.length,
		// 		unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		// 	});
		// });

		// disp.on("em.xmpp.contacts.remove", function (message) {
		// 	var pageStack = getCurrentPages();
		// 	if (pageStack[pageStack.length - 1].route === me.route) {
		// 		me.getRoster();
		// 	}
		// });

		// //监听未读“聊天”
		// disp.on("em.xmpp.unreadspot", function () {
		// 	me.setData({
		// 		unReadSpotNum: getApp().globalData.unReadMessageNum > 99 ? '99+' : getApp().globalData.unReadMessageNum,
		// 	});
		// });
		// //监听未读加群“通知”数
		// disp.on("em.xmpp.invite.joingroup", function () {
		// 	me.setData({
		// 		unReadNoticeNum: getApp().globalData.saveGroupInvitedList.length,
		// 		unReadTotalNotNum: getApp().globalData.saveFriendList.length + getApp().globalData.saveGroupInvitedList.length
		// 	});
		// });
		// disp.on("em.xmpp.subscribed", function () {
		// 	var pageStack = getCurrentPages();
		// 	if (pageStack[pageStack.length - 1].route === me.route) {
		// 		me.getRoster();
		// 	}
		// });

		// if (JSON.stringify(option) === '{}') {
		// 	this.data.myName = wx.getStorageSync("myUsername")
		// } else {
		// 	this.data.myName = option.myName
		// }
		// this.setData({
		// 	myName: this.data.myName
		// });
	},

	onShow() {
		if(getApp().globalData.isTmId){
			this.data.tmId = getApp().globalData.tmId;
		}
		if(!getApp().globalData.norefreshMessage){
			this.setData({
				url:`${cng.APP_SERVER}/?t=${new Date().getTime()}&phone=${wx.getStorageSync("phone")}&hospitalId=${cng.HOSPITAL_ID}&openid=${wx.getStorageSync('openid')}&appid=${cng.WXAPP_ID}&hyjToken=${wx.getStorageSync('hyjToken')}&hyjUserInfo=${JSON.stringify(wx.getStorageSync('hyjUserInfo'))}&shopToken=${wx.getStorageSync('shopToken')}&userId=${wx.getStorageSync('userId')}/?tmId=${this.data.tmId||''}`
			})
		}
		// TODOS:注意 vue的#/這個網址後綴在小程序webview上是不會刷新的
		console.log(this.data.url,"this is url");
	},

	getRoster() {
		let me = this;
		let rosters = {
			success(roster) {
				var member = [];
				console.log(roster, "这个是获取联系人的");
				for (let i = 0; i < roster.length; i++) {
					if (roster[i].subscription == "both") {
						member.push(roster[i]);
					}
				}
				wx.setStorage({
					key: "member",
					data: member
				});
				me.setData({
					member: member
				});
				if (!systemReady) {
					disp.fire("em.main.ready");
					systemReady = true;
				}
				me.getBrands(member);
			},
			error(err) {
				console.log("[main:getRoster]", err);
			}
		};
		// WebIM.conn.setPresence()
		WebIM.conn.getRoster(rosters);

	},

	moveFriend: function (message) {
		let me = this;
		let rosters = {
			success: function (roster) {
				var member = [];
				for (let i = 0; i < roster.length; i++) {
					if (roster[i].subscription == "both") {
						member.push(roster[i]);
					}
				}
				me.setData({
					member: member
				});
			}
		};
		if (message.type == "unsubscribe" || message.type == "unsubscribed") {
			WebIM.conn.removeRoster({
				to: message.from,
				success: function () {
					WebIM.conn.unsubscribed({
						to: message.from
					});
					WebIM.conn.getRoster(rosters);
				}
			});
		}
	},

	handleFriendMsg: function (message) {
		wx.showModal({
			title: "添加好友请求",
			content: message.from + "请求加为好友",
			success: function (res) {
				if (res.confirm == true) {
					WebIM.conn.subscribed({
						to: message.from,
						message: "[resp:true]"
					});
					WebIM.conn.subscribe({
						to: message.from,
						message: "[resp:true]"
					});
				} else {
					WebIM.conn.unsubscribed({
						to: message.from,
						message: "rejectAddFriend"
					});
				}
			},
			fail: function (err) {}
		});
	},

	delete_friend: function (event) {
		const me = this;
		var delName = event.currentTarget.dataset.username;
		var myName = wx.getStorageSync("myUsername"); // 获取当前用户名
		wx.showModal({
			title: "确认删除好友" + delName,
			cancelText: "取消",
			confirmText: "删除",
			success(res) {
				if (res.confirm == true) {
					WebIM.conn.removeRoster({
						to: delName,
						// success: function(){
						// 	WebIM.conn.unsubscribed({
						// 		to: delName
						// 	});
						// 	// wx.showToast({
						// 	// 	title: "删除成功",
						// 	// });
						// 	me.toastSuccess('删除成功');
						// 	// 删除好友后 同时清空会话
						// 	wx.setStorageSync(delName + myName, "");
						// 	wx.setStorageSync("rendered_" + delName + myName, "");
						// 	me.getRoster();
						// 	disp.fire('em.main.deleteFriend')
						// },
						// error: function(error){
						// 	me.toastSuccess('删除失败');
						// }
					});
					me.toastSuccess('删除成功');
					// 删除好友后 同时清空会话
					wx.setStorageSync(delName + myName, "");
					wx.setStorageSync("rendered_" + delName + myName, "");
					me.getRoster();
					disp.fire('em.main.deleteFriend')
				}
			}
		});
	},

	openSearch: function () {
		this.setData({
			search_btn: false,
			search_friend: true,
			show_mask: true,
			gotop: true
		});
	},

	clearInput: function () {
		this.setData({
			input_code: '',
			show_clear: false
		})
	},

	onInput: function (e) {
		let inputValue = e.detail.value
		if (inputValue) {
			this.setData({
				show_clear: true
			})
		} else {
			this.setData({
				show_clear: false
			})
		}
	},

	cancel: function () {
		this.setData({
			search_btn: true,
			search_friend: false,
			gotop: false
			//show_mask: false
		});
		this.getBrands(this.data.member)
	},

	onSearch: function (val) {
		let searchValue = val.detail.value
		let member = this.data.member;
		let serchList = [];
		member.forEach((item, index) => {
			if (String(item.name).indexOf(searchValue) != -1) {
				serchList.push(item)
			}
		})
		this.getBrands(serchList)
	},

	add_new: function () {
		wx.navigateTo({
			url: "../add_new/add_new"
		});
	},

	tab_chat: function () {
		wx.redirectTo({
			url: "../chat/chat"
		});
	},

	close_mask: function () {
		this.setData({
			search_btn: true,
			search_friend: false,
			//show_mask: false
		});
	},

	tab_setting: function () {
		wx.redirectTo({
			url: "../setting/setting"
		});
	},

	tab_notification: function () {
		wx.redirectTo({
			url: "../notification/notification"
		});
	},

	into_inform: function () {
		wx.navigateTo({
			url: "../inform/inform?myName=" + this.data.myName //wx.getStorageSync("myUsername")
		});
	},

	into_groups: function () {
		wx.navigateTo({
			url: "../groups/groups?myName=" + this.data.myName
		});
	},

	into_room: function (event) {
		console.log(event, this.data.myName)
		var nameList = {
			myName: this.data.myName,
			your: event.target.dataset.username
		};



		wx.navigateTo({
			url: "../chat/chatroom?username=" + JSON.stringify(nameList)
		});
	},

	into_info: function (event) {
		wx.navigateTo({
			url: "../friend_info/friend_info?yourname=" + event.target.dataset.username
		});
	},

	//点击右侧字母导航定位触发
	scrollToViewFn: function (e) {
		let that = this;
		let _id = e.target.dataset.id;
		for (let i = 0; i < that.data.listMain.length; ++i) {
			if (that.data.listMain[i].id === _id) {
				that.setData({
					isActive: _id,
					toView: 'inToView' + _id
				})
				break
			}
		}
	},



	// 页面滑动时触发
	onPageScroll: function (e) {
		if (e.detail) {
			// this.setData({
			//   scroolHeight: e.detail.scrollTop
			// });
			if (e.detail.scrollTop > 20) {
				this.setData({
					showFixedTitile: true
				});
			} else {
				this.setData({
					showFixedTitile: false
				});
			}
			for (let i in oHeight) {
				if (e.detail.scrollTop - 20 < oHeight[i].height) {
					this.setData({
						isActive: oHeight[i].key,
						fixedTitle: oHeight[i].name
					});
					return false;
				}
			}
		}
	},

	// 处理数据格式，及获取分组高度
	getBrands: function (member) {
		const that = this;
		const reg = /[a-z]/i;
		// member = [
		// 	{
		// 		groups: [],
		// 		jid: "easemob-demo#chatdemoui_zdtest2@easemob.com",
		// 		name: "adtest2",
		// 		subscription:"both"
		// 	}
		// ]

		member.forEach((item) => {
			if (reg.test(item.name.substring(0, 1))) {
				item.initial = item.name.substring(0, 1).toUpperCase();
			} else {
				item.initial = '#'
			}
		})
		member.sort((a, b) => a.initial.charCodeAt(0) - b.initial.charCodeAt(0))
		var someTtitle = null;
		var someArr = [];

		for (var i = 0; i < member.length; i++) {
			var newBrands = {
				brandId: member[i].jid,
				name: member[i].name
			};

			if (member[i].initial == '#') {
				if (!lastObj) {
					var lastObj = {
						id: i,
						region: '#',
						brands: []
					};
				}
				lastObj.brands.push(newBrands);
			} else {
				if (member[i].initial != someTtitle) {
					someTtitle = member[i].initial
					var newObj = {
						id: i,
						region: someTtitle,
						brands: []
					};
					someArr.push(newObj)
				}
				newObj.brands.push(newBrands);
			}
		};
		someArr.sort((a, b) => a.region.charCodeAt(0) - b.region.charCodeAt(0))
		if (lastObj) {
			someArr.push(lastObj)
		}
		//  someArr = [
		// 	{
		//         id: "1", region: "A",
		//         brands: [
		//           	{ brandId: "..", name: "阿明" },
		//           	{ brandId: "..", name: "奥特曼" },
		//           	{ brandId: "..", name: "安庆" },
		//           	{ brandId: "..", name: "阿曼" }
		//         ]
		//     },
		// ]

		//赋值给列表值
		that.setData({
			listMain: someArr
		});
		//赋值给当前高亮的isActive
		that.setData({
			isActive: someArr[0].id,
			fixedTitle: someArr[0].region
		});

		//计算分组高度,wx.createSelectorQuery()获取节点信息
		let number = 0;
		for (let j = 0; j < someArr.length; ++j) {
			wx.createSelectorQuery().select('#inToView' + someArr[j].id).boundingClientRect(function (rect) {

				number = rect.height + number;
				var newArry = [{
					'height': number,
					'key': rect.dataset.id,
					"name": someArr[j].region
				}]
				//that.setData({
				oHeight = oHeight.concat(newArry)
				//})
				console.log(oHeight, "这个是高度哦哦哦哦哦");
			}).exec();
		};
	},
});


let a = `
<!-- <view class="main_title {{gotop? 'main_title_hide':'main_title_show'}}">
<text>联系人</text>
</view> -->

<view class="main_body">
<!-- <view wx:for="{{ member }}" class="numbers" wx:key="word">
	<view class="nbr_header">{{ item.word }}</view>
	<view class="info" bindtap="into_info">
		<image src="../../images/number.png"  data-username="{{ item.name }}"></image>
	</view>
	<view class="nbr_body" data-username="{{ item.name }}" bindtap="into_room">
		<text data-username="{{ item.name }}">{{ item.name }}</text>
	</view>
	<view class="delete" bindtap="delete_friend" data-username="{{ item.name }}">
		<image src="../../images/delete.png"  data-username="{{ item.name }}"></image>
	</view>
</view> -->
<view>
<!-- 左侧列表内容部分 -->
<scroll-view
class="content {{gotop? (isIPX? 'goTopX': 'goTop'): 'goback'}}"  
enable-back-to-top scroll-into-view="{{toView}}" 
scroll-y="true" scroll-with-animation="true" 
bindscroll="onPageScroll" 
style="padding-bottom: {{isIPX?'46rpx':'20rpx'}}"> 
	<!-- search -->
	<view class="search" wx:if="{{ search_btn }}">
		<view bindtap="openSearch">
			<icon type="search" size="13"></icon>
			<text>搜索</text>
		</view>
	</view>
	<view class="search_input" wx:if="{{ search_friend }}">
		<view>
			<icon type="search" size="13"></icon>
			<input placeholder="搜索" 
				placeholder-style="color:#CFCFCF;line-height:20px;font-size:12px;" 
				auto-focus
				confirm-type="search"
				type='text'
				bindconfirm="onSearch"
				bindinput="onInput"
				value="{{input_code}}"
				></input>
				<icon type="clear" size="13" catchtap='clearInput' wx:if="{{ show_clear }}"></icon>
		</view>
		<text bindtap="cancel">取消</text>
	</view>
	<!-- other item -->
	<!-- <view class="contain">
		<view class="otherItem" bindtap="add_new">
			<image src="../../images/invite_theme@2x.png"  data-username="name"></image>
			<text>添加好友</text>
			<image class='line' src="../../images/line.png"></image> -->
			<!-- 0.5px border -->
		<!-- </view> -->
		<!-- <view class="chat" bindtap="into_inform">
			<image src="../../images/chat.png"></image>
			<text>申请与通知</text>
			<text  class="em-msgNum">3</text>
			<text wx:if="{{ messageNum > 0 }}" class="em-msgNum">{{ messageNum }}</text>
		</view> -->
		<!-- <view class="otherItem" bindtap="into_groups">
			<image src="../../images/group@2x.png"></image>
			<text>群组</text>
		</view> -->
	 <!-- <view class="chat_lists">
			<image src="../../images/cell_groups.png"></image>
			<text>聊天室列表</text>
		</view> -->
	<!-- </view> -->

		<view wx:for="{{listMain}}" wx:for-item="group" wx:key="id"  id="{{ 'inToView'+group.id}}" data-id='{{group.id}}'> 
			<view class="address_top" >{{group.region}}</view> 
				<view wx:for="{{group.brands}}" wx:for-item="item" wx:key="{{group.brandId}}" data-username="{{ item.name }}" catchtap="delete_friend"> 
			<swipe-delete >
				<view class="tap_mask" catchtap="into_room" data-username="{{ item.name }}">
								<view class="address_bottom" data-username="{{ item.name }}" catchtap="into_room">
						<image src="../../../public/img/chat/theme@2x.png" catchtap="into_room" data-username="{{ item.name }}"></image>
									<text catchtap="into_room" data-username="{{ item.name }}">{{item.name}}</text>
							</view>
						</view>
					</swipe-delete>
				</view> 
		</view> 
	</scroll-view> 
	<!-- 顶部固定分类 -->
	<view class="list-fixed {{fixedTitle=='' ? 'hide':''}} {{gotop? 'fixedTitleTop': ''}}" wx:if="{{showFixedTitile}}" style="transform:translate3d(0,{{fixedTop}}px,0);">
			<view class="fixed-title">
				{{fixedTitle}}
			</view>
	</view>
	<!-- 右侧字母导航 -->
	<view class="orientation_region"> 
				<block wx:for="{{listMain}}"  wx:key="id"> 
					<view class="orientation_city {{isActive==item.id ? 'active':'' }}" bindtap="scrollToViewFn" data-id="{{item.id}}" >{{item.region}}
					</view> 
			</block> 
	</view>  
</view>
</view>

<!-- <view class="mask" bindtap="close_mask" wx:if="{{show_mask}}"></view> -->`