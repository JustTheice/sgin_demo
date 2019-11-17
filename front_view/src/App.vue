<template>
  <button id="btn" @click="reqSgin">点我签到</button>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
	methods: {
		reqSgin(){
			axios.get('/api/sgin')
				.then(
					(data) => {
						console.log(data);
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
