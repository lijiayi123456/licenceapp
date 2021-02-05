<template>
    <div class="apply-licence-wrap">
        <div class="apply-licence-wrap-header">
            <span class="icon iconfont icon-left" @click="goback"></span> 
            许可申请
        </div>
        <div class="apply-licence-wrap-main">
            <el-form :model="licenceForm" :rules="licenceFormRules" ref="licenceForm">
                <!-- <el-form-item props="userName" label="操作员">
                    <el-input  v-model="licenceForm.userName" disabled></el-input>
                </el-form-item> -->
                <el-form-item prop="proposer" label="申请人">
                    <el-input  v-model="licenceForm.proposer" disabled ></el-input>
                </el-form-item>
                <el-form-item prop="department" label="部门名称">
                    <el-input  v-model="licenceForm.department" disabled ></el-input>
                </el-form-item>
                <el-form-item prop="customerName" label="客户名称">
                    <el-input  v-model="licenceForm.customerName" :disabled="disabledEdit" ></el-input>
                </el-form-item>
                <el-form-item prop="programName" label="项目名称">
                    <el-input  v-model="licenceForm.programName" :disabled="disabledEdit"></el-input>
                </el-form-item>
                <!-- <el-form-item props="programDepartment" label="项目部门">
                    <el-input  v-model="licenceForm.programDepartment"></el-input>
                </el-form-item> -->
                <el-form-item prop="description" label="备注">
                    <el-input type="textarea" v-model="licenceForm.description" :disabled="disabledEdit"></el-input>
                </el-form-item>
                <el-form-item prop="applicationCode" label="申请码">
                    <el-input type="textarea" v-model="licenceForm.applicationCode" :disabled="disabledEdit"></el-input>
                </el-form-item>
                <el-form-item label="连接数" class="el-form-required" >
                    <el-radio-group v-model="licenceForm.connectNumb" :disabled="disabledEdit || operation === 'approval'">
                        <el-radio label='20'>20台</el-radio>
                        <el-radio label='50'>50台</el-radio>
                        <el-radio label='100'>100台</el-radio>
                        <el-radio label='500'>500台</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="许可期限" class="el-form-required">
                    <el-radio-group 
                        v-model="licenceForm.validPeriod" 
                        :disabled="disabledEdit || operation === 'approval'"
                        @change="onDaysSelectedChanged">
                        <el-radio label="30">30天</el-radio>
                        <el-radio label="90">90天</el-radio>
                        <el-radio label="180">180天</el-radio>
                        <el-radio label="360">360天</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="许可模块" class="el-form-required">
                    <div class="el-form-table">
                        <el-table ref="modulesTable" :data="selectedModules" max-height=200 border :header-cell-style="{background:'#f5f7fa'}">
                            <el-table-column label="产品名称" prop="productName" width="120">
                                <template slot-scope="scope">
                                    <span>
                                        {{scope.row.productName + '('+ scope.row.productUniqueName +')'}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="模块名称" prop="name" width="110" align="center">
                            </el-table-column>
                            <el-table-column label="起始时间" prop="startTime" width="100" align="center">
                            </el-table-column>
                            <el-table-column label="到期时间" prop="endTime" width="100" align="center">
                            </el-table-column>
                            <el-table-column label="操作" v-if="disabledEdit === false && operation != 'approval'">
                                <template slot-scope="scope">
                                    <el-button plain size="small" type="danger" @click="deleteModule(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button 
                            class="without-margin-button" 
                            size="small" 
                            plain type="primary" 
                            @click="showAddModulesDialog"
                            v-if="disabledEdit === false && operation != 'approval'"
                            >添加</el-button>
                    </div>
                </el-form-item>
                <el-form-item props="licenseCode" label="许可码">
                    <el-input type="textarea" v-model="licenceForm.licenseCode" readonly></el-input>
                    <div style="margin-left:80px;" v-if="licenceForm.licenseCode">
                        <el-button  class="without-margin-button" size="small" plain type="primary" @click="copyLink($event)" @mouseenter="copyLink($event)">复制</el-button>
                        <!-- <el-button  class="without-margin-button" size="small" plain type="primary" @click="downLoadCode()">下载</el-button> -->
                    </div>
                    
                </el-form-item>
                
            </el-form>
            <div class="apply-licence-wrap-footer">
                <el-button size="small" plain type="primary" @click="submitApply" v-if="disabledEdit === false && operation != 'approval'">提交申请</el-button>
                <el-button size="small" plain type="primary" @click="approvalApply" v-if="disabledEdit === false && operation === 'approval'" >同意</el-button>
                <el-button size="small" plain type="primary" @click="rejectApply" v-if="disabledEdit === false && operation === 'approval'">拒绝</el-button>
            </div>
        </div>
        
        <AddModulesDialog ref="addModulesDialog" @makeSureSelectModules="makeSureSelectModules"></AddModulesDialog>
    </div>
</template>

<script>
import AddModulesDialog from '@/views/AddModulesDialog.vue'
import { submitLicenceForm,approvalOrder,downloadLicenceCode } from '../api/licenceApi';
import { validForm } from '../api/comonFunction/validForm';
import Clipboard from 'clipboard';

export default {
    components: {
        AddModulesDialog
    },

    created() {
        // 从路由获取数据
        if(this.$route.query.licenceDetail) {
            let licenceDetail = this.$route.query.licenceDetail
            this.licenceForm.proposer = licenceDetail.userIdentify.userName;
            this.licenceForm.department = licenceDetail.userIdentify.department;
            this.licenceForm.orderIdentify = licenceDetail.orderIdentify
            this.licenceForm.customerName = licenceDetail.customerName
            this.licenceForm.programName = licenceDetail.programName
            this.licenceForm.applicationCode = licenceDetail.applicationCode
            this.licenceForm.connectNumb = licenceDetail.connectNumb + ''
            this.licenceForm.validPeriod = licenceDetail.validPeriod
            this.licenceForm.licenceModule = licenceDetail.licenceModule
            this.licenceForm.licenseCode = licenceDetail.licenseCode
            this.licenceForm.description = licenceDetail.description
            this.selectedModules = licenceDetail.licenseScope;
            let licenceStartTime = licenceDetail.updateTime.replace(/-/g,'/');
            this.selectedModules = this.dealSelectModules(new Date(licenceStartTime));
        }
        if(this.$route.query.disabledEdit === 'true') {
            this.disabledEdit = true;
        }
        if(this.$route.query.disabledEdit === 'false') {
            this.disabledEdit = false;
        }
        this.operation = this.$route.query.operation;

    },
    mounted() {
        // 初次进入，需获取用户的具体信息
        this.currentUserInfo = this.$store.state.userInfo;
        // 若该值为空，则需要从store中去拿
        // 若该值不为空,值已从路由中拿到值，不需要重新赋值
        if(this.licenceForm.proposer === '') {
            this.licenceForm.proposer = this.currentUserInfo.userName;
            this.licenceForm.department = this.currentUserInfo.department; // 获取部门
        }
    },
    data() {
        // const validateLayerName = (rule, value, callback) => {
        //     // const patrn = /[\\/\\"<>\\?|\\*]/;
        //     const reStr = /^[a-zA-Z\u4e00-\u9fa5]{1}/;
        //     const regEn = /[`~!@#$%^&*()+= <>?:"{},.\\/;'[\]]/im;
        //     const regCn = /[·！#￥（——）：；“”‘、，…… |《。》？、【】[\]]/im;
        //     if (regEn.test(value) || regCn.test(value)) {
        //         callback(new Error('图层名只能包含数字、中文、字母、下划线、短横线！'));
        //         } else if(!reStr.test(value)){
        //         callback(new Error('图层名必须以汉字或字母开头'));
        //         }else if(value.length > 50){
        //         callback(new Error('图层名长度不能超过50字符'));
        //         }else {
        //         callback();
        //     }
        // };
        const validateApplicationCode = (rule, value, callback) => {
            value = value.replace(/ /g,'');  // 去掉value中的空格
            if (value.length !=32) {
                callback(new Error('无效的申请码'));
            } else if(this.isValidCode(value) === false) {
                callback(new Error('无效的申请码'))
            } else {
                callback();
            }
        };
        return {
            orderStatus: '无状态', // 订单状态
            licenceForm: {
                orderIdentify: '',  // 订单号
                proposer: '', // 申请人
                customerName: '', // 客户名称
                programName: '', // 项目名称
                programDepartment: '', // 项目部门
                applicationCode:'',  // 申请码
                connectNumb: '20', // 连接数
                validPeriod: '30', // 许可期限
                licenceModule: [], // 许可模块
                licenseCode: '', // 许可码
                description: '', //描述
                userIdentify: '', // 用户标识
                operation: '', // 操作类型
            },
            selectedModules: [],
            currentUserInfo: {},
            disabledEdit: false, // 是否可编辑

            // 表单校验
            licenceFormRules: {
                customerName: [
                    {required: true, message: '请输入客户名称',trigger: 'blur'}
                ],
                programName: [
                    {required: true, message: '请输入项目名称',trigger: 'blur'}
                ],
                applicationCode: [
                    {required: true, message: '请输入申请码', trigger: 'blur'},
                    { validator: validateApplicationCode, trigger: 'blur' },
                ],
                connectNumb: [
                    {required: true, message: '请输入连接数', trigger: 'blur'}
                ],
                validPeriod: [
                    {required: true, message: '请输入许可期限',trigger: 'blur'}
                ]
            }
        }
    },
    methods: {
        goback() {
            // 若审批申请提交成功，跳转至待审批界面
            this.$router.push({
                name:'Home',
                params:{
                    orderStatus:this.orderStatus
                }
            })
        },
        showAddModulesDialog() {
            this.$refs.addModulesDialog.dialogVisible = true;
        },
        onDaysSelectedChanged() {
            this.selectedModules = this.dealSelectModules(new Date());
        },
        // 删除选择的记录
        deleteModule(index) {
            this.$confirm('是否删除该模块','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.selectedModules.splice(index,1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        // 提交申请
        submitApply() {
            if(validForm(this.$refs.licenceForm)) {
                if(this.selectedModules.length === 0) {
                    this.$message.warning('请添加许可模块');
                } else {
                    let params = {
                        "applicationCode": this.licenceForm.applicationCode, // 申请码
                        "connectNumb": this.licenceForm.connectNumb * 1,
                        "customerName": this.licenceForm.customerName,
                        "description": this.licenceForm.description,
                        "licenseScope": this.selectedModules,
                        "programDepartment": '',
                        "programName": this.licenceForm.programName,
                        "userIdentify": this.currentUserInfo.userIdentify,
                        "validPeriod": this.licenceForm.validPeriod,
                    }
                    submitLicenceForm(params).then((res)=>{
                        // 1 为已同意，说明已自动审批成功
                        if(res.approvalStatus === '1') {
                            this.$alert('许可码生成成功','提示',{
                                confirmButtonText: '确定',
                                callback: () => {
                                    // 直接显示生成的许可码
                                    this.licenceForm.licenseCode = res.licenseCode;
                                    this.disabledEdit = true;
                                    this.orderStatus = '已同意';  // 为了跳转回首页，可正常显示
                                }
                            })
                        } else if(res.approvalStatus === '0') {
                            this.$alert('许可审批提交成功','提示',{
                                confirmButtonText: '确定',
                                callback: () => {
                                    // 则跳转至待审批界面
                                    this.orderStatus = '待审批';
                                    this.goback();
                                }
                            })
                        }
                    })
                }
            } else {
                this.$message.warning('请输入完整信息!');
            }
        },

        //============================审批许可===========================================
        approvalApply() {
            this.$confirm('是否同意此审批','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                approvalOrder(this.licenceForm.orderIdentify,1).then(()=>{
                    this.$message.success('审批通过');
                    this.goback();
                })
            }).catch(()=>{
                this.$message({
                    type: 'info',
                    message: '已取消操作'
                })
            })
            
        },
        rejectApply() {
            this.$prompt('请输入拒绝理由','拒绝理由', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValidator: this.validateRejectDescrition,
            }).then(({value})=>{
                approvalOrder(this.licenceForm.orderIdentify,2,value).then(()=>{
                    this.$message.success('已拒绝该审批');
                    setTimeout(()=>{
                        this.goback();
                    },1000)
                    
                })
            }).catch(()=>{
                this.$message({
                    type:'info',
                    message: '已取消操作'
                })
            })
        },
        //============================复制、下载许可码====================================
        copyLink (e) {
            let data = this.licenceForm.licenseCode;
            const clipboard = new Clipboard(e.target, { text: () => data })
            clipboard.on('success', () => {
                this.$message.success({message: '复制成功', showClose: true})
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', () => {
                this.$message({message: '复制失败,', showClose: true, type: 'error'})
                clipboard.destroy()
            })
            clipboard.onClick(e); // 为了解决需要点击第二次才生效的问题
        },
        // 下载许可码
        downLoadCode() {
            let licenseCode = this.licenceForm.orderIdentify;
            downloadLicenceCode(licenseCode).then(()=>{
                this.$message.success('下载许可码成功');
            })
        },
        //============================添加模块===========================================
        makeSureSelectModules(selectedModules) {
            this.selectedModules = this.mergeArray(this.selectedModules,selectedModules);
            //console.log(this.selectedModules)
            let startTime = new Date();
            // 合并当前模块与新加入模块

            // 为模块添加开始时间到到期时间
            this.selectedModules = this.dealSelectModules(startTime)
        },

        //============================功能函数==============================================
        //拒绝理由校验
        validateRejectDescrition(value) {
            if(!value) {
                return '请输入拒绝理由';
            } else if(!value.trim()) {
                return '请输入拒绝理由';
            }
        },
        // 获取未来时间,参数当前时间currentTime:date类型；往后推得时间timeInterval，天数
        getFutureTime(currentTime,timeInterval) {
            let endDate = new Date(currentTime);
            endDate.setDate(endDate.getDate() + timeInterval);
            return this.date2String(endDate)
        },
        add0(m) {
            return m < 10 ? '0' + m : m;
        },
        // 时间Date格式转字符串的日期格式 如：2021-01-27 12:00:00
        date2String(date) {
            let time = new Date(date);
            let y = time.getFullYear();
            let m = time.getMonth() + 1;
            let d = time.getDate();
            let h = time.getHours();
            let mm = time.getMinutes();
            let s = time.getSeconds();
            return [y,this.add0(m),this.add0(d)].join('-') + ' ' + [this.add0(h),this.add0(mm),this.add0(s)].join(':');
        },
        //处理选择的许可模块,time是Date格式的，起始时间
        dealSelectModules(time) {
            let newSelectModules = [];
            let startTime = this.date2String(time);
            let endTime = this.getFutureTime(time,parseInt(this.licenceForm.validPeriod))
            this.selectedModules.forEach((item)=>{
                item.startTime = startTime;
                item.endTime = endTime;
                newSelectModules.push(item)
            })
            return newSelectModules;
        },
        // 判断两个数组是否有相同数据，若有则去重
        mergeArray(originModules,newModules) {
            let originModulesListNameList = [];
            originModules.forEach((item)=>{
                originModulesListNameList.push(item.uniqueName + '-' + item.productUniqueName);
            })
            let mergeModules = [];
            mergeModules = mergeModules.concat(originModules);
            newModules.forEach((item)=>{
                if(originModulesListNameList.includes(item.uniqueName + '-' + item.productUniqueName) === false) {
                    mergeModules.push(item)
                }
            })
            return mergeModules;
        },
        // 判断是否是有效的许可码，判断所有的字符串是否是16进制的
        isValidCode(code) {
            let valid = true;
            let newCode = code.toUpperCase();  //全部转为大写字母
            const char16 = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
            newCode.split("").forEach((c)=>{
                if(char16.includes(c) === false) {
                    valid = false;
                }
            }) 
            return valid;
        }
    }
}
</script>

<style lang="scss">
    .apply-licence-wrap {
        text-align: left;
        .apply-licence-wrap-header {
            padding-left: 10px;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #eee;
        }
        .apply-licence-wrap-main {
            height: calc(100vh - 50px);
            overflow: auto;
            padding-left: 10px;
            margin-top: 10px;
            .el-form-item__label {
                width: 80px;
                text-align: left;
            }
            .el-form-item__error {
                margin-left: 80px;
            }
            .el-form-required {
                .el-form-item__label:before {
                    content: '*';
                    float: right;
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
            .el-textarea {
                width: calc(100% - 100px);
            }
            .el-radio-group {
                width: 200px;
            }
            .el-radio {
                width: 60px;
                line-height: 40px;
            }
            .el-form-table {
                width: calc(100% - 100px);
                float: left;
            }
            .el-input {
                width: calc(100% - 100px);
            }
            .el-button {
                margin-left:0px !important;
            }
            
        }
        .apply-licence-wrap-footer {
            height: 60px;
            line-height: 60px;
            border-top: 1px solid #eee;
            text-align: center;
        }
    }
</style>