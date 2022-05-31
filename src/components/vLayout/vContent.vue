<template>
  <div>
    <div :style=" countStyle">
     <div style="border-bottom: 1px solid rgba(236,236,236,0.55);text-align:left"> <a-icon :type="showCountIcon" style="padding-right: 5px;color: #1890ff" @click="showCountHandler" />统计信息:</div>
     <div v-if="showCount">
       <a-row>
         <a-col :span="8">
           <div class="card">
             <a-icon type="user" style="padding-right: 5px"/>发送告警信息:
             <div class="cardData">
               {{FireMessage}}
             </div>
           </div>
         </a-col>
         <a-col :span="8">
           <div class="card">
             <a-icon type="user" style="padding-right: 5px"/>告警订阅者:
             <div class="cardData">
               {{SubscribeCount}}
             </div>
           </div>
         </a-col>
         <a-col :span="8">
           <div class="card">
             <a-icon type="user" style="padding-right: 5px"/>告警订阅规则:
             <div class="cardData">
               {{AlertRules}}
             </div>
           </div>
         </a-col>

       </a-row>

     </div>

    </div>
    <div style=" background: white;padding:15px;border:1px solid #7675753D;margin-top: 15px">
      <router-view/>
    </div>


  </div>
</template>

<script>
// import vReceiver from '../vReceiver'

export default {
  name: "vContent",
  // components: {vReceiver},
  data() {
    return {
      FireMessage: 1,
      SubscribeCount: 1,
      AlertRules: 1,
      showCount:true,
      countStyle:{background: 'white',padding:'15px',border:'1px solid #7675753D',height:'170px'},
      showCountIcon:"eye",
    }
  },
  mounted() {},
  methods:{
    showCountHandler(){
      this.showCount=!this.showCount
      if( !this.showCount){
          this.countStyle.height="50px"
          this.showCountIcon="eye-invisible"
      }else {
        this.countStyle.height="170px"
        this.showCountIcon="eye"
      }
    }
  }
}
</script>

<style scoped>
.card{
  margin: 10px;
  border: 1.5px solid #7675753D;
  text-align:center;
  height: 100px;
  width: 80%;
  padding: 10px;
  border-radius:10px;
  color: #1890ff;
}
.cardData{
  padding: 10px;
  font-size: 30px;
  color: #22A640;
}
</style>