<template>
    <div class="add-modules-dialog-wrap">
        <el-dialog
            title="添加模块"
            :visible.sync="dialogVisible"
            width="90%"
            :close-on-click-modal="false"
            >
            <div class="add-modules-dialog-main">
                <span style="margin-right: 10px;">产品名称</span>
                <el-select v-model="productName">
                    <el-option
                        v-for="(value,key) of productModulesDict" :key="key"
                        :value="key">
                    </el-option>
                </el-select>
                <el-table 
                    :data="productModulesDict[productName]" 
                    @selection-change="handleSelectionChange"
                    ref="multipleTable"
                    max-height="200">
                    <el-table-column
                        type="selection"
                        width="55"
                    ></el-table-column>
                    <el-table-column prop="name" label="模块名称">
                    </el-table-column>
                    <el-table-column prop="uniqueName" label="模块标识">

                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" plain @click="makeSure">确定</el-button>
                <el-button type="primary" size="small" plain @click="close"> 取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getLicenceModulesList } from '../api/licenceApi';
// import Clipboard from 'clipboard'
export default {
    mounted() {
        this.getLicenceModulesList();
        this.selectedModules = [];
        
    },
    data() { 
        return {
            dialogVisible: false,
            licenceNumber: '',
            productName: '',
            selectedModules: [],
            productModulesDict:{},
        }
    },
    methods: {
        close() {
            this.dialogVisible = false;
            this.$refs.multipleTable.clearSelection();
        },
        handleSelectionChange(val) {
            this.selectedModules = val;
        },
        getLicenceModulesList() {
            this.productModulesDict = {};
            getLicenceModulesList().then((res)=>{
                res.items.forEach((element) => {
                  this.productModulesDict[element.name] = element.modules;
                });
                this.productName = Object.keys(this.productModulesDict)[0];
            })
        },
        // 确认选择的数据
        makeSure() {
            this.$emit('makeSureSelectModules',this.selectedModules);
            this.dialogVisible = false;
            this.$refs.multipleTable.clearSelection();
        }
    } 

}
</script>

<style lang="scss">
.licencenumber-dialog-wrap {
    .el-dialog__footer {
        text-align: center;
    }
    .el-textarea__inner {
        height: 100px;
    }
}
    
</style>