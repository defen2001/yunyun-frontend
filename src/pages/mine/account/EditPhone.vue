<script lang="ts" setup>
import { updateBasicInfo } from '@/api/user.ts'
import { User } from '@/models/user'
import { computed, reactive } from 'vue'


const phone = reactive({ value: '', valid: false })


const updateButtonValid = computed(() => {
  return phone.valid
})

const handleSubmit = () => {
  updateBasicInfo({ phone: phone.value } as User)
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
