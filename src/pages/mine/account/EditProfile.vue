<script lang="ts" setup>
import { updateBasicInfo } from '@/api/user.ts'
import { User } from '@/models/user'
import { ref } from 'vue'

const props = defineProps<{ profile: string }>()

const profile = ref(props.profile)

const handleSubmit = () => {
  updateBasicInfo({ profile: profile.value } as User)
}
</script>

<template>
  <van-form label-width="60px" @submit="handleSubmit">
    <van-cell-group inset>
      <!-- 个人简介 -->
      <van-field
          v-model="profile"
          autosize
          label="个人简介"
          maxlength="50"
          placeholder="填写你的个人简介"
          rows="2"
          show-word-limit
          style="margin: 16px 0"
          type="textarea"
      />
      <!-- 保存按钮 -->
      <van-button block native-type="submit" type="primary">保存</van-button>
    </van-cell-group>
  </van-form>
</template>
