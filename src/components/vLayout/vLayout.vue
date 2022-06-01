<template>
  <a-layout id="components-layout-demo-responsive" >
    <a-layout-sider
        breakpoint="lg"
        collapsed-width="0"

    >
<!--      @collapse="onCollapse"-->
<!--      @breakpoint="onBreakpoint"-->

      <div class="logo">PrometheusAlertFire</div>
      <a-menu theme="dark" mode="inline" >
        <a-menu-item key="1">
          <a-icon type="user"/>
          <span class="nav-text">Receiver</span>
          <router-link to="/receiver"></router-link>

        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="video-camera"/>
          <span >Subscribe</span>
          <router-link to="/Subscribe"></router-link>
        </a-menu-item>



<!--        <a-menu-item >-->
<!--          <MyIcon :type="l1.icon"></MyIcon>-->
<!--          <span>{{ l1.menu_name }}</span>-->
<!--          <router-link :to="l1.menu_url"></router-link>-->
<!--        </a-menu-item>-->



      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }"/>
      <a-layout-content >
        <div :style="{ padding: '24px',  minHeight: '900px' }">
          <vContent></vContent>
        </div>
      </a-layout-content>
<!--      <a-layout-footer style="textAlign: center">-->
<!--        PrometheusAlertFire-->
<!--      </a-layout-footer>-->
    </a-layout>
  </a-layout>
</template>
<script>
import vContent from "./vContent"

export default {
  components: {
    vContent
  },
  methods: {
    // onCollapse(collapsed, type) {
    //   console.log("vvvvvvvvv",collapsed, type);
    // },
    // onBreakpoint(broken) {
    //   console.log(broken,"brokenbrokenbroken");
    // },
  },
};
</script>

<style>
#components-layout-demo-responsive .logo {
  height: 32px;
  /*background: #edd1d8;*/
  margin: 16px;
  font-weight: bold;
  padding-top: 5px;
  color: #22A640;
}
</style>
