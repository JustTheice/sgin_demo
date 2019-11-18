const express = require('express');
const app = express()
const port = 5000
const fs = require('fs');
let toDay = 17; //记录当天是几号

app.get('/sign', (req, res) => {
	let userName = req.query.name;
	sginIn(userName);
	res.send('收到！');
});

app.get('/info', (req, res) => {
	let userName = req.query.name;
	getData((ret) => {
		let userJson = JSON.stringify(ret.find((item,index) => item.name === userName));
		res.send(userJson);
	});
})

app.listen(port, () => console.log(`server is running...`));



//执行签到函数
function sginIn(userName){
	//读取文件，找到对应的用户，修改签到属性，再存入文件
	getData((ret) => {
		let userData = ret.find((item, index) => userName === item.name);
		//如果有用户，则修改记录。否则就新增一个用户
		if(userData){
			if(userData.todaySigned){
				return;
			}
			userData.allCount++;
			userData.todaySigned = true;
			userData.connectCount++;
			userData.score+=5;
			if(userData.connectCount%5===0){
				userData.score+=5;
			}
		} else {
			let userData = {
				name: userName,
				allCount: 1,
				connectCount: 1,
				todaySigned: true,
				score: 5
			};
			ret.push(userData);
		}
		
		//存入文件
		fs.writeFile('./data.json', JSON.stringify(ret), (err) => {
			if(err){
				return console.log(err);
			}
		})
	});
}

//获取文件
function getData(cb){
	fs.readFile('./data.json', (err,data) => {
		if(err){
			console.log(err);
			return;
		}
		let ret = JSON.parse(data.toString());
		cb && cb(ret);
	})
}


//监视时间
function watchDay(){
	//每隔一段时间检查一次当前是几号，如果发生变化，则处理用户数据并更新记录
	setInterval(() => {
		let date = new Date();
		let nowH = date.getHours();
		if(nowH!=toDay){
			getData((ret) => {
				ret.forEach((item,index) => {
					//1.判断连续签到
					if(!item.todaySigned){ //如果当前用户当天没有签到，则将其连续签到天数清零
						item.connectCount = 0;
					}
					//2.更改当日签到状态
					item.todaySigned = false;
				});
				fs.writeFile('./data.json', JSON.stringify(ret), (err) => {
					if(err){
						return console.log(err);
					}
				})
			});
			//3.更新日期
			toDay = nowH;
		}
	},3000);
}
watchDay();