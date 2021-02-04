<template>
  <div class="home-wrap">
    <div class="home-wrap-main">
      <el-tabs v-model="activeName" type="card" v-if="operation == 'apply'">
        <el-tab-pane label="已审批" name="1">
          <ApplyList v-loading="loadData" :dataList="promiseDataList" @showLicenceCode="showLicenceCode" @showLicenceDetail="showLicenceDetail"></ApplyList>
        </el-tab-pane>
        <el-tab-pane label="待审批" name="0">
          <ApplyList v-loading="loadData" :dataList="promiseDataList" @showLicenceDetail="showLicenceDetail"></ApplyList>
        </el-tab-pane>
      </el-tabs>
      <el-tabs v-model="activeName" type="card" v-if="operation == 'approval'">
        <el-tab-pane label="待处理" name="0">
          <ApplyList v-loading="loadData" :dataList="promiseDataList" @showLicenceDetail="approvalLicenceApply"></ApplyList>
        </el-tab-pane>
        <el-tab-pane label="已处理" name="1">
          <ApplyList v-loading="loadData" :dataList="promiseDataList" @showLicenceCode="showLicenceCode" @showLicenceDetail="showLicenceDetail"></ApplyList>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="home-wrap-footer">
      <!--首页选中状态-->
      <span class="icon iconfont icon-index" 
        style="color:#409EFF;" 
        v-if="operation==='apply' && userInfo.authority==='0'"
        >
      </span>
      <!--首页未选中状态-->
      <span class="icon iconfont icon-shouye"  
        v-if="operation !=='apply' && userInfo.authority==='0'"  
        @click="goBackHome">
        
      </span>
      <span class="icon iconfont icon-plus1" @click="applyLicence" style="color:#409EFF;" ></span>
      <!-- 未激活审批状态 -->
      <span class="icon iconfont icon-seal" 
        v-if="operation!=='approval' && userInfo.authority==='0'" 
        @click="adminApproval">
      </span>
      <!-- 激活审批状态 -->
      <span class="icon iconfont icon-seal3" 
        v-if="operation==='approval' && userInfo.authority==='0'" 
        style="color:#409EFF;"
        ></span>
      
      
      <!-- <i class="el-icon-s-tools" 
        v-if="userInfo.authority==='0'"
      ></i> -->
    </div>

    <LicenceCodeDialog 
      :dialogVisible="isLicenceNumberDialogShow" 
      :licenceProp="currentLicence"
      @closeLicenceCodeDialog="closeLicenceCodeDialog"
      ></LicenceCodeDialog>
  </div>
</template>

<script>
import ApplyList from '@/components/ApplyList.vue';
import LicenceCodeDialog from '@/views/LicenceCodeDialog.vue';
import { getOrderList } from '../api/licenceApi';

export default {
  components: { 
    ApplyList, 
    LicenceCodeDialog 
  },
  // keep-alive激活的生命周期
  activated() {
    if(this.$route.params.orderStatus != undefined) {
      if(this.$route.params.orderStatus === '待审批') {
        this.activeName = '0';
        this.operation = 'apply';
      }
      if(this.$route.params.orderStatus === '已同意') {
        this.activeName = '1';
        this.operation = 'apply';
      }
    } 
    if(this.userIdentify) {
      this.getOrderList(this.activeName);
    }
  },
  // mounted() {
    
  // },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
    userIdentify() {
      return this.$store.state.userInfo.userIdentify;
    }
  },
  watch: {
    activeName(val) {
      // this.$http.get('https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=ww819cb229594cb6b9&corpsecret=TtyLjxhMIe6Krj-szTatnqSlyRZ-BJnXGdP7mbjFLT8').then((res)=>{
      //   console.log(res)
      // })
      // 1为已审批/已拒绝，0为待审批
      if(val === '1') {
        this.getOrderList(1);
      } else {
        this.getOrderList(0);
      }
    },
    userIdentify() {
      this.getOrderList(this.activeName);
    }
  },
  data() {
    return {
      loadData: true, // 加载数据
      activeName: '1',  // 已审批
      dataList:[],
      promiseDataList: [],
      unPromiseDataList: [],
      isLicenceNumberDialogShow: false, // 许可码对话框是否展示
      operation: 'apply', // apply申请,approval审批
      currentLicence: {},
    }
  },
  methods: {
    // 获取用户列表
      getOrderList(approvalStatus) {
        if(this.userIdentify) {
          this.loadData = true;
          this.promiseDataList = [];
          getOrderList(this.userIdentify,approvalStatus).then((res)=>{
            this.promiseDataList = res;
            if(this.operation === 'apply') {
              this.promiseDataList = res.filter(item=>item.userIdentify.userIdentify === this.userIdentify)
            }
            this.loadData = false;
          })
        }     
      },

      // 申请许可
      applyLicence() {
        this.$router.push({path:'/apply'})
      },

      // 展示许可详情
      showLicenceDetail(data) {
        // 若普通用户，审批被拒绝，则可编辑，重新提交
        if(data.approvalStatus === '2' && this.operation === 'apply') {
          this.$router.push({path:'/apply',query:{
            licenceDetail:data,
            disabledEdit: false
          }})
        } else {
          // 若审批已通过，则不可编辑
          this.$router.push({path:'/apply',query:{
            licenceDetail:data,
            disabledEdit: true
          }})
        }
      },

      // 管理员审批申请
      approvalLicenceApply(data) {
        this.$router.push({path:'/apply',query:{
          licenceDetail: data,
          disabledEdit: false,
          operation: this.operation
        }})
      },

      // 展示许可码对话框
      showLicenceCode(item) {
        this.currentLicence = item;
        this.isLicenceNumberDialogShow = true;
      },
      // 关闭许可详情对话框
      closeLicenceCodeDialog() {
        this.isLicenceNumberDialogShow = false;
      },

      // 管理员审批,或关闭审批状态
      adminApproval() {
        this.operation = 'approval';
        this.activeName = '0';
        this.getOrderList(0);        
      },
      // 返回首页
      goBackHome() {
        this.operation = 'apply';
        this.activeName = '1';
        this.getOrderList(1);
      }
  }
    
}
</script>

<style lang="scss">
.home-wrap {
  .el-tabs__nav {
    width: 100%;
    max-width: 500px;
  }
  .el-tabs__item {
    width: 50%;
  }
  .el-tabs__item.is-active {
    color: white;
    background: #409EFF;
  }
  .el-tabs__header {
    margin: 0px;
  }
  .home-wrap-main {
    height: calc(100vh - 60px);
    overflow: hidden;
    //margin-bottom: 5px;
    //border-bottom: 1px solid #eee;
  }
  .home-wrap-footer {
    height: 60px;
    line-height: 60px;
    border-top: 1px solid #eee;
    .icon,.el-icon-s-check:before,.el-icon-s-tools:before{
      padding-right: 30px;
      padding-left: 30px;
      font-size: 30px;
    }
    .apply-style {
      color:black;
    }
    .unapply-style {
      color:#409EFF;
    }
  }
}
  
</style>
