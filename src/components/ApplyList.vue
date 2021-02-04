<template>
    <div class="apply-wrap">
        <div v-if="dataListKeys.length === 0" style="margin-top: 100px;">
            暂无数据
        </div>
        <ul v-else>
            <li v-for="(item,key) in dataList" :key="key" >
                <div style="float:left;width:60%;" @click="showLicenceDetail(item)">
                    <p :title="item.programName" >
                        <span class="long-text-style">
                            {{item.programName}}
                        </span>
                    </p>
                    <p :title="item.customerName" >
                        <span class="long-text-style">
                            {{item.customerName}}
                        </span>
                    </p>
                    <p 
                        :class="{'promise-style':item.approvalStatus==='1','reject-style':item.approvalStatus==='2','unpromise-style':item.approvalStatus==='0'}"
                        class="long-text-style"
                        :title="statusMap[item.approvalStatus] + (item.approvalStatus === '2'?',  拒绝理由：' + item.rejectedDescription:'')"
                    >
                        {{statusMap[item.approvalStatus]}}{{item.approvalStatus === '2'?',  拒绝理由：' + item.rejectedDescription:''}}
                    </p>
                </div>
                <div class="apply-wrap-time" @click="showLicenceDetail(item)">
                    {{item.updateTime}}
                </div>
              <div style="float:left;width:10%;line-height:100px;" v-if="item.approvalStatus==='1'">
                <span class="icon iconfont icon-more" @click="showLicenceCode(item)"></span>
              </div>
              <div style="clear:both;">
              </div>
            </li>
          </ul>
    </div>
</template>

<script>


export default {
    props: {
        dataList:{
            default: []
        },
    },
    computed: {
        dataListKeys() {
            return Object.keys(this.dataList);
        }
    },
    data() {
        return {
           statusMap :{
                "0": '待审批',
                "1": '已同意',
                "2": '已拒绝'
            }
        } 
    },
    methods: {
        showLicenceCode(item) {
            this.$emit('showLicenceCode',item)
        },
        showLicenceDetail(data) {
            this.$emit('showLicenceDetail',data)
        }
    }
}
</script>

<style lang="scss">
.apply-wrap {
    // margin-top: 5px;
    // border: 1px solid #eee;
    height: calc(100vh - 100px);
    overflow: auto;
    li {
        height: 100px;
        text-align: left;
        line-height: 30px;
        border-bottom: 1px solid #eee;
        align-items: center;
        display: flex;
        
    }
    p {
        margin-left: 20px;
    }
    .promise-style {
        font-size: 12px;
        color: green;
    }
    .reject-style {
        font-size: 12px;
        color: red;
    }
    .unpromise-style {
        font-size: 12px;
        color: #ccc;
    }
    .apply-wrap-time {
        float: left;
        width: 30%;
        line-height: 30px;
    }
}

</style>