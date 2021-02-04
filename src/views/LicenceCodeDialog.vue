<template>
    <div class="licencecode-dialog-wrap">
        <el-dialog
            title="查看许可码"
            :visible.sync="dialogVisible"
            width="80%"
            :show-close="false"
            :close-on-click-modal="false"
            >
            <el-input type="textarea" v-model="licenceCode" readonly></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" plain @click="copyLink(licenceCode)" class="tag">复制</el-button>
                <!-- <el-button type="primary" size="small" plain @click="downLoadCode()">下载</el-button> -->
                <el-button type="primary" size="small" plain @click="close"> 取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Clipboard from 'clipboard';
import {downloadLicenceCode} from '../api/licenceApi';

export default {
    props: {
        dialogVisible: {
            default: false
        },
        licenceProp: {
            default: ''
        },
    },
    watch: {
        dialogVisible(val) {
            if(val === true) {
                this.licenceCode = this.licenceProp.licenseCode;
            }
        },
        
    },
    data() {
        return {
            licenceCode:'',
        }
    },
    methods: {
        close() {
            this.$emit('closeLicenceCodeDialog');
        },
        // 复制许可码
        copyLink (data) {
            const clipboard = new Clipboard('.tag', {
                text: function () {
                    return data
                }
            })
            clipboard.on('success', () => {
                this.$message({message: '复制成功', showClose: true, type: 'success'})
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', () => {
                this.$message({message: '复制失败,', showClose: true, type: 'error'})
                clipboard.destroy()
            })
        },
        // 下载许可码
        downLoadCode() {
            downloadLicenceCode(this.licenceProp.orderIdentify).then(()=>{
                this.$message.success('下载许可码成功');
            })
        }
    }

}
</script>

<style lang="scss">
.licencecode-dialog-wrap {
    .el-dialog__footer {
        padding: 0px 20px 10px;
        text-align: center;
    }
    .el-textarea__inner {
        height: 100px;
    }
    .el-dialog__body {
        padding: 10px 20px;
    }
}
    
</style>