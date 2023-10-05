<script lang="ts" setup>
import { updateBasicInfo } from '@/api/user.ts'
import { User } from '@/models/user'
import { ref } from 'vue'

const props = defineProps<{ username: string }>()

const username = ref(props.username)

const handleSubmit = () => {
  updateBasicInfo({ username: username.value } as User)
}
</script>

<template>
  <van-form label-width="50px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 昵称 -->
      <van-field
          v-model="username"
          :rules="[{ pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/, message: '昵称必须由 2~10 位的中英文或数字组成' }]"
          label="昵称"
          placeholder="请输入昵称"
          style="margin: 16px 0"
      />
      <!-- 保存按钮 -->
      <van-button block native-type="submit" type="primary">保存</van-button>
    </van-cell-group>
  </van-form>
</template>
