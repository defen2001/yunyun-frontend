<script lang="ts" setup>
import { loginByPassword, loginByVerificationCode } from '@/api/user.ts'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()


const userAccount = ref('');
const userPassword = ref('');
/**
 * 登录表单项
 */
// const phone = reactive({ value: '', valid: false })
// const password = reactive({ value: '', valid: false })
// const code = reactive({ value: '', valid: false })

// const handleCodeChange = (value: string) => {
//   code.value = value
//   code.valid = /^\d{6}$/.test(value)
// }

/**
 * 登录按钮
 */
// const loginByCode = ref(true)

// const loginButtonValid = computed(() => {
//   return loginByCode.value ?
//       phone.valid && code.valid :
//       phone.valid && userPassword.valid
// })

// const handleSubmit = () => {
//   let operation = loginByCode.value ?
//       loginByVerificationCode(phone.value, code.value) :
//       loginByPassword(phone.value, userPassword.value)
//   operation.then((resp) => {
//     let { user, token } = resp.data.data
//     localStorage.setItem('userId', user.id)
//     localStorage.setItem('token', token)
//     router.back()
//   })
// }

const onSubmit = () => {
  let operation = loginByPassword(userAccount.value, userPassword.value);
  operation.then((resp) => {
    let { user, token } = resp.data.data
    localStorage.setItem('userId', user.id)
    localStorage.setItem('token', token)
    router.push('/home')
  })
};
</script>

<template>

<!--  <van-nav-bar title="登录中心"/>-->


  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="支持数字、字母、下划线"
          :rules="[{ required: true, message: '请填写账号' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码长度限制 6 ~ 15"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>
  <div style="margin: 16px;">
    <van-button
        round
        block
        type="primary"
        @click="$router.push('/register')"
    >
      注册
    </van-button>
  </div>
</template>
