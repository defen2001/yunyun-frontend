<script lang="ts" setup>
import { userRegister } from '@/api/user.ts'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()



/**
 * 注册表单项
 */
const userAccount = reactive({ value: '', valid: false })
const userPassword = reactive({ value: '', valid: false })
const checkPassword = reactive({ value: '', valid: false })

const registerButtonValid = computed(() => {
  return userAccount.valid && userPassword.valid && checkPassword.valid
})
const onSubmit = () => {
  let operation = userRegister(userAccount.value, userPassword.value, checkPassword.value);
  operation.then((resp) => {
    let code = resp.data.code
    if (code === 0){
      router.push('/login');
    }
  })
};
</script>

<template>

<!--  <van-nav-bar title="注册中心"/>-->


  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount.value"
          :rules="[{ required: true, message: '请填写账号' }]"
          :update:model-value="userAccount.valid = userAccount.value !== null"
          label="账号"
          placeholder="支持数字、字母、下划线"
      />
      <van-field
          v-model="userPassword.value"
          :rules="[{ pattern: /^.{8,}$/, message: '密码必须大于 8 位' }]"
          :update:model-value="userPassword.valid = /^.{8,}$/.test(userPassword.value)"
          type="password"
          label="密码"
          placeholder="请输入密码"
      />
      <van-field
          v-model="checkPassword.value"
          :rules="[
            { pattern: /^.{8,}$/, message: '密码必须大于 8 位' },
            { validator: (value) => value === userPassword.value, message: '两次密码不一致' }
          ]"
          :update:model-value="checkPassword.valid = /^.{8,}$/.test(checkPassword.value)"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button
          :disabled="!registerButtonValid"
          block
          native-type="submit"
          style="margin-top: 16px"
          type="primary"
      >
        注册
      </van-button>
    </div>
  </van-form>
</template>
