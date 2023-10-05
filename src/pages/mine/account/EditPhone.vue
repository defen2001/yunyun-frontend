<script lang="ts" setup>
import { updatePhoneNumber } from '@/api/user.ts'
import SendCode from '@/components/SendCode.vue'
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const phone = reactive({ value: '', valid: false })
const code = reactive({ value: '', valid: false })

const handleCodeChange = (value: string) => {
  code.value = value
  code.valid = /^\d{6}$/.test(value)
}

const updateButtonValid = computed(() => {
  return phone.valid && code.valid
})

const handleSubmit = () => {
  updatePhoneNumber(phone.value, code.value).then(() => {
    localStorage.removeItem('userId')
    localStorage.removeItem('token')
    router.push('/login')
  })
}
</script>

<template>
  <van-form label-width="50px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 手机号 -->
      <van-field
          v-model="phone.value"
          :update:model-value="phone.valid = /^1[3-9]\d{9}$/.test(phone.value)"
          label="手机号"
          placeholder="请输入手机号"
          style="margin-top: 16px"
          type="tel"
      />
      <!-- 验证码 -->
      <SendCode
          :phone="phone.value"
          :phoneValid="phone.valid"
          @update:code="handleCodeChange"
      />
      <!-- 换绑按钮 -->
      <van-button
          :disabled="!updateButtonValid"
          block
          native-type="submit"
          style="margin-top: 16px"
          type="primary"
      >
        换绑
      </van-button>
    </van-cell-group>
  </van-form>
</template>
