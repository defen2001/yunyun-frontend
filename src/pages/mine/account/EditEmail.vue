<script lang="ts" setup>
import { updateBasicInfo } from '@/api/user.ts'
import { User } from '@/models/user'
import { ref } from 'vue'

const props = defineProps<{ email: string }>()

const email = ref(props.email)

const handleSubmit = () => {
  updateBasicInfo({ email: email.value } as User)
}
</script>

<template>
  <van-form label-width="60px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 邮箱 -->
      <van-field
          v-model="email"
          label="邮箱"
          placeholder="填写你的邮箱"
          style="margin: 16px 0"
          type="email"
      />
      <!-- 保存按钮 -->
      <van-button block native-type="submit" type="primary">保存</van-button>
    </van-cell-group>
  </van-form>
</template>
