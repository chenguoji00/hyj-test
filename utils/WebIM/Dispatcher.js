var dispCbs = [];
var dispIns = [];

function Dispatcher(){
	
	dispIns.push(this);
	dispCbs.push({});
	// dispCbs :
		// 0:{}
		// 1:{	em.chat.audio.fileLoaded: (2) [ƒ, ƒ]
		// 	em.chat.session.remove: [ƒ]
		// 	em.chatroom.leave: [ƒ]
		// 	em.main.deleteFriend: [ƒ]
		// 	em.main.ready: [ƒ]
		// 	em.xmpp.error.passwordErr: [ƒ]
		// }
}
Dispatcher.prototype = {
	
	on(type, cb){
		console.log(type,"中间隔开",cb)
		let cbtypes = dispCbs[dispIns.indexOf(this)];
		let cbs = cbtypes[type] = (cbtypes[type] || []);
		if(!~cbs.indexOf(cb)){
			cbs.push(cb);
		}
	},
	off(type, cb){
		// let cbtypes = dispCbs[dispIns.indexOf(this)];
		// let cbs = cbtypes[type] = (cbtypes[type] || []);
		// let curTypeCbIdx = cbs.indexOf(cb);
		// if(~curTypeCbIdx){
		// 	cbs.splice(curTypeCbIdx, 1);
		// }
	},
	fire(type, ...args){
		console.log(type,"这个是调度者Dispatcher的原型上的 fire 方法",...args)
		let cbtypes = dispCbs[dispIns.indexOf(this)];
		let cbs = cbtypes[type] = (cbtypes[type] || []);
		console.log(args,"this is args")
		for(let i = 0; i < cbs.length; i++){
			cbs[i].apply(null, args);
		}
	}
};
module.exports = Dispatcher;
