<template>
  <div>
    <input type="text" placeholder="请输入你的昵称" v-model="name">
    <p>你好{{name}}</p>
    <p>已签到{{allCount || 0}}天</p>
    <p>连续签到{{connectCount || 0}}天</p>
    <p>今日是否签到: {{todaySigned ? '是' : '否'}}</p>
    <p>当前积分{{score || 0}}</p>
    <button @click="reqSgin">点我签到</button>
    <button @click="reqInfo">更新信息</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  mounted() {
    //获取签到信息
    this.reqInfo();
  },
  name: 'App',
  data(){
    return {
      allCount: 0,
      connectCount: 0,
      todaySigned: false,
      score: 0,
      name: 'lin'
    }
  },
	methods: {
    //签到
		reqSgin(){
      if(this.todaySigned){
        return alert('今天已经签过了！');
      }
			axios.get(`/api/sign?name=${this.name}`)
				.then(
					(ret) => {
						console.log(ret.data);
            this.reqInfo();
					},
					(err) => {
						console.log('请求失败，报错信息如下');
						console.log(err);
					}
				);
		},
    //获取信息
    reqInfo(){
      axios.get(`/api/info?name=${this.name}`)
        .then(
          (ret) => {
            let {data} = ret;
            this.allCount = data.allCount;
            this.connectCount = data.connectCount;
            this.todaySigned = data.todaySigned;
            this.score = data.score;
          },
          (err) => {
            console.log('请求失败，报错信息如下');
            console.log(err);
      		}
     );
    }
	}
}
</script>

<style>
</style>
