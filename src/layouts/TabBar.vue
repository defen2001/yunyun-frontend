<template>
  <RouterView />
  <!-- 标签栏 -->
  <van-tabbar placeholder route>
    <van-tabbar-item icon="wap-home-o" to="/home">主页</van-tabbar-item>
    <van-tabbar-item icon="friends-o" to="/team">队伍</van-tabbar-item>
    <van-tabbar-item icon="contact" to="/mine">我的</van-tabbar-item>
  </van-tabbar>
</template>
