<template>
  <div>
    <div :style=" countStyle">
     <div style="border-bottom: 1px solid rgba(236,236,236,0.55);text-align:left"> <a-icon :type="showCountIcon" style="padding-right: 5px;color: #1890ff" @click="showCountHandler" />统计信息:</div>
     <div v-if="showCount">
       <a-row>
         <a-col :span="8">
           <div class="card">
             <my-icon type="icon-AlertOn" style="padding-right: 5px;font-size: 15px" />发送告警信息:
             <div class="cardData">
               <span>{{SummaryData.fireTotal}}</span><span style="color: red;font-size: 10px;padding-right: 20px">次</span><span  style="color: red;">{{(SummaryData.fireTotal-SummaryData.fireSuccessTotal)}}</span><span style="color: red;font-size: 10px">失败</span>
             </div>
           </div>
         </a-col>
         <a-col :span="8">
           <div class="card">
             <my-icon type="icon-user" style="padding-right: 5px;font-size: 15px"/>告警订阅者:
             <div class="cardData">
               {{SummaryData.receiverTotal}}
             </div>
           </div>
         </a-col>
         <a-col :span="8">
           <div class="card">
             <my-icon type="icon-rule" style="padding-right: 5px;font-size: 15px"/>告警订阅规则:
             <div class="cardData">
               {{SummaryData.subscribeTotal}}
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

import {ListSummary} from  '../api/summary'
export default {
  name: "vContent",
  // components: {vReceiver},
  data() {
    return {
      showCount:true,
      countStyle:{background: 'white',padding:'15px',border:'1px solid #7675753D',height:'170px'},
      showCountIcon:"eye",
      SummaryData:{
        fireTotal: 0,
        fireSuccessTotal: 0,
        subscribeTotal: 0,
        receiverTotal: 0},
    }
  },
  mounted() {
    this.ListSummaryHandler();
  },
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
    },

    ListSummaryHandler() {

      ListSummary().then(res => {
        if (res.data.flag) {

          this.SummaryData = res.data.data.data
        } else if (res.data.flag !== true) {
          this.$message.error(res.data.msg);
        }
      });
    },

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