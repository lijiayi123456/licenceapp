// 校验表单是否有效
export function validForm(form) {
    let isValid = false
    form.validate((valid)=>{
        if(valid) {
            isValid = true;
        } else {
            isValid = false;
        }
    })
    return isValid;
}