<script lang="ts" setup>
import { updatePassword } from '@/api/user.ts'
import SendCode from '@/components/SendCode.vue'
import { computed, reactive } from 'vue'

const props = defineProps<{ phone: string }>()

const code = reactive({ value: '', valid: false })
const password = reactive({ value: '', valid: false })

const handleCodeChange = (value: string) => {
  code.value = value
  code.valid = /^\d{6}$/.test(value)
}

const updateButtonValid = computed(() => {
  return password.valid && code.valid
})

const handleSubmit = () => {
  updatePassword(password.value, code.value)
}
</script>

<template>
  <van-form label-width="50px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 手机号 -->
      <van-field
          v-model="props.phone"
          disabled
          label="手机号"
          style="margin-top: 16px"
          type="tel"
      />
      <!-- 验证码 -->
      <SendCode
          :phone="undefined"
          :phoneValid="true"
          @update:code="handleCodeChange"
      />
      <!-- 密码 -->
      <van-field
          v-model="password.value"
          :rules="[{ pattern: /^.{6,}$/, message: '密码必须大于 6 位' }]"
          :update:model-value="password.valid = /^.{6,}$/.test(password.value)"
          label="新密码"
          placeholder="请输入新密码"
          type="password"
      />
      <!-- 修改密码按钮 -->
      <van-button
          :disabled="!updateButtonValid"
          block
          native-type="submit"
          style="margin-top: 16px"
          type="primary"
      >
        修改密码
      </van-button>
    </van-cell-group>
  </van-form>
</template>
