<script lang="ts" setup>
import { updatePassword } from '@/api/user.ts'
import { computed, reactive } from 'vue'

const password = reactive({ value: '', valid: false })
const oldPassword = reactive({ value: '', valid: false })
const confirmPassword = reactive({ value: '', valid: false })


const updateButtonValid = computed(() => {
  return password.valid && oldPassword.valid && confirmPassword.valid
})

const handleSubmit = () => {
  updatePassword(password.value, oldPassword.value, confirmPassword.value)
}
</script>

<template>
  <van-form label-width="60px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 旧密码 -->
      <van-field
          v-model="oldPassword.value"
          :rules="[{ required: true, message: '请输入旧密码' }]"
          :update:model-value="oldPassword.valid = oldPassword.value !== null"
          label="旧密码"
          placeholder="请输入旧密码"
          type="password"
      />
      <!-- 新密码 -->
      <van-field
          v-model="password.value"
          :rules="[{ pattern: /^.{8,}$/, message: '密码必须大于 8 位' }]"
          :update:model-value="password.valid = /^.{8,}$/.test(password.value)"
          label="新密码"
          placeholder="请输入新密码"
          type="password"
      />
      <!-- 确认密码 -->
      <van-field
          v-model="confirmPassword.value"
          :rules="[
            { pattern: /^.{8,}$/, message: '密码必须大于 8 位' },
            { validator: (value) => value === password.value, message: '两次密码不一致' }
          ]"
          :update:model-value="confirmPassword.valid = /^.{8,}$/.test(confirmPassword.value)"
          label="确认密码"
          placeholder="请再次输入新密码"
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
