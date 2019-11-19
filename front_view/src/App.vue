<template>
  <div id="wrap">
    <mt-header fixed title="麦迪格签到系统"></mt-header>
    <section id="content">
      <input type="text" placeholder="请输入你的昵称" v-model="name">
      <div id="info" class="clearfloat">
        <img src="../static/img/avatar.jpg">
        <div>
          <p><span>你好{{name}}</span>,<span>当前积分{{score || 0}}</span></p>
          <p>已签到{{allCount || 0}}天</p>
          <p>连续签到{{connectCount || 0}}天</p>
          <p>今日是否签到: {{todaySigned ? '是' : '否'}}</p>
        </div>
      </div>
      <mt-button @click="reqSgin" type="primary">点我签到</mt-button>
      <mt-button @click="reqInfo('数据更新成功')" type="primary">更新信息</mt-button>
    </section>
    <p id="rule">每次签到得5分，每连续5天签到额外得5分</p>
  </div>
</template>

<script>
import axios from 'axios';
import {Indicator, Toast,} from 'mint-ui';
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
      name: 'lin',
      baseUrl: 'http://192.168.9.195:5000'
    }
  },
	methods: {
    //签到
		reqSgin(){
      if(this.todaySigned){
        return Toast('今天已经签过了！');
      }
			axios.get(`${this.baseUrl}/sign?name=${this.name}`)
				.then(
					(ret) => {
						console.log(ret.data);
            this.reqInfo('签到成功');
					},
					(err) => {
						console.log('请求失败，报错信息如下');
						console.log(err);
					}
				);
		},
    //获取信息
    reqInfo(msg){
      msg && Indicator.open('更新数据中');
      axios.get(`${this.baseUrl}/info?name=${this.name}`)
        .then(
          (ret) => {
            let {data} = ret;
            this.allCount = data.allCount;
            this.connectCount = data.connectCount;
            this.todaySigned = data.todaySigned;
            this.score = data.score;
            Indicator.close();
            msg && Toast(msg);
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

<style lang="less">
  *{
    margin: 0;
    padding: 0;
  }
  #wrap{
    #content{
      margin-top: 40px!important;
      text-align: center;
      margin: 0 auto;
      >input{
        margin-top: 15px;
      }
      #info{
        width: 70%;
        margin: 20px auto;
        img{
          width: 30%;
          float: left;
        }
        >div{
          float: left;
          width: 70%;
        }
      }
    }
    #rule{
      margin-top: 30px;
      font-size: 14px;
      color: rgb(127,127,127);
      text-align: center;
    }
  }

  .clearfloat:after{display:block;clear:both;content:"";}
</style>
