<script lang="ts" setup>
import { sendVerificationCode } from '@/api/user.ts'
import { ref } from 'vue'

const props = defineProps<{
  phone: string | undefined
  phoneValid: boolean
}>()

const emits = defineEmits<{
  (e: 'update:code', value: string): void
}>()

/**
 * 验证码
 */
const code = ref('')

const sendCode = () => {
  sendVerificationCode(props.phone).then(() => {
    setCodeCooling()
  })
}

/**
 * 验证码冷却
 */
const codeCooling = ref(false)
const codeCoolingTime = ref(60)
const setCodeCooling = () => {
  codeCooling.value = true
  let timer = setInterval(() => {
    codeCoolingTime.value--
    if (codeCoolingTime.value === 0) {
      codeCoolingTime.value = 60
      codeCooling.value = false
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<template>
  <van-field
      v-model="code"
      :update:model-value="emits('update:code', code)"
      label="验证码"
      placeholder="请输入验证码"
      type="number"
  >
    <template #button>
      <van-divider vertical />
      <!-- 允许获取验证码 -->
      <span
          v-if="props.phoneValid && !codeCooling"
          class="send-code-button"
          style="color:#1989fa"
          @click="sendCode"
      >
        获取验证码
      </span>
      <!-- 手机号格式错误或验证码冷却中 -->
      <span v-else class="send-code-button">
        {{ codeCooling ? `重新发送(${codeCoolingTime})` : '获取验证码' }}
      </span>
    </template>
  </van-field>
</template>

<style scoped>
.send-code-button {
  display: inline-block;
  width: 6em;
  text-align: center;
}
</style>
