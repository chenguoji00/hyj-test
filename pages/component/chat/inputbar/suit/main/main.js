let WebIM = require("../../../../../../utils/huanxinIM/WebIM")["default"];
let msgType = require("../../../msgtype");
let disp = require("../../../../../../utils/huanxinIM/broadcast");
Component({
	properties: {
		username: {
			type: Object,
			value: {},
		},
		chatType: {
			type: String,
			value: msgType.chatType.SINGLE_CHAT,
		},
	},
	data: {
		inputMessage: "",		// render input 的值
		userMessage: "",		// input 的实时值
	},

	methods: {
		focus(){
			this.triggerEvent("inputFocused", null, { bubbles: true });
		},

		blur(){
			this.triggerEvent("inputBlured", null, { bubbles: true });
		},

		isGroupChat(){
			return this.data.chatType == msgType.chatType.CHAT_ROOM;
		},

		getSendToParam(){
			return this.isGroupChat() ? this.data.username.groupId : this.data.username.your;
		},

		// bindinput 不能打冒号！
		bindMessage(e){
			this.setData({
				userMessage: e.detail.value
			});
		},

		emojiAction(emoji){
			var str;
			var msglen = this.data.userMessage.length - 1;
			if(emoji && emoji != "[del]"){
				str = this.data.userMessage + emoji;
			}
			else if(emoji == "[del]"){
				let start = this.data.userMessage.lastIndexOf("[");
				let end = this.data.userMessage.lastIndexOf("]");
				let len = end - start;
				if(end != -1 && end == msglen && len >= 3 && len <= 4){
					str = this.data.userMessage.slice(0, start);
				}
				else{
					str = this.data.userMessage.slice(0, msglen);
				}
			}
			this.setData({
				userMessage: str,
				inputMessage: str
			});
		},

		sendMessage(){
			let me = this;

			String.prototype.trim=function()
			{
			     return this.replace(/(^\s*)|(\s*$)/g, '');
			}
			//在String的原型上添加去空格的方法
			// 当这个输入框的值去掉空格之后然后什么都没有的话就不发送消息，return出去
			if(!this.data.userMessage.trim()){
				return;
			}
			let id = WebIM.conn.getUniqueId(); // 生成本地消息id
			let msg = new WebIM.message(msgType.TEXT, id);
			console.log(this.data.username,"这个是什么东西来的哦  在 inputbar 里面的main")
			msg.set({
				msg: this.data.userMessage,
				from: this.data.username.myName,
				to: this.getSendToParam(),
				roomType: false,
				chatType: this.data.chatType,
				success(id, serverMsgId){
					console.log('成功了')
					disp.fire('em.chat.sendSuccess', id, me.data.userMessage);
				},
				fail(id, serverMsgId){
					console.log('失败了')
				}
			});
			if(this.data.chatType == msgType.chatType.CHAT_ROOM){
				msg.setGroup("groupchat");
			}
			console.log('发送消息', msg)
			WebIM.conn.send(msg.body);
			this.triggerEvent(
				"newTextMsg",
				{
					msg: msg,
					type: msgType.TEXT,
				},
				{
					bubbles: true,
					composed: true
				}
			);
			//
			this.setData({
				userMessage: "",
				inputMessage: "",
			});
		},
	},

	// lifetimes
	created(){},
	attached(){},
	moved(){},
	detached(){},
	ready(){},
});
