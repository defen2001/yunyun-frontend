<script lang="ts" setup>
import { getAccountInfo, updateAvatar, updateBasicInfo } from '@/api/user.ts'
import { User } from '@/models/user'
import { PickerOption, showNotify } from 'vant'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 用户信息
 */
const userInfo = ref<User>({} as User)

onMounted(() => {
  getAccountInfo().then((resp) => {
    console.log(resp)
    userInfo.value = resp.data.data
    userInfo.value.createTime = userInfo.value.createTime.split(' ')[0]
  })
})

/**
 * 头像
 */
const handleAvatarUpload = (file: any) => {
  // 校验文件类型
  if (!file.file.type.startsWith('image')) {
    showNotify({ type: 'warning', message: '仅支持上传图片' })
    return
  }
  // 校验文件大小
  if (file.file.size > 2 * 1024 * 1024) {
    showNotify({ type: 'warning', message: '图片大小不能超过 2MB' })
    return
  }
  updateAvatar(file.file).then(() => {
    userInfo.value.avatarUrl = file.content
  })
}

/**
 * 性别
 */
const gender = computed(() => {
  return [ '保密', '男', '女' ][userInfo.value.gender]
})

const showGenderPicker = ref(false)
const genderPickerList = [
  { text: '保密', value: 0 },
  { text: '男', value: 1 },
  { text: '女', value: 2 },
]
const handlePickerConfirm = ({ selectedOptions }: PickerOption) => {
  updateBasicInfo({ gender: selectedOptions[0].value } as User).then(() => {
    userInfo.value.gender = selectedOptions[0].value
    showGenderPicker.value = false
  })
}

/**
 * 退出登录
 */
const handleLogout = () => {
  localStorage.removeItem('userId')
  localStorage.removeItem('token')
  router.push('/home')
}
</script>

<template>
  <!-- 头像 -->
  <van-cell center is-link title="头像">
    <template #value>
      <van-uploader :after-read="handleAvatarUpload">
        <van-image
            :src="userInfo.avatarUrl"
            fit="cover"
            height="80px"
            round
            width="80px"
        />
      </van-uploader>
    </template>
  </van-cell>
  <!-- 昵称 -->
  <van-cell
      :to="{path: '/account/username', query: {data: userInfo.username}}"
      :value="userInfo.username || '未设置'"
      is-link
      title="昵称"
  />
  <!-- 性别 -->
  <van-cell :value="gender" is-link title="性别" @click="showGenderPicker = true" />
  <van-popup v-model:show="showGenderPicker" position="bottom">
    <van-picker
        :columns="genderPickerList"
        title="性别"
        @cancel="showGenderPicker = false"
        @confirm="handlePickerConfirm"
    />
  </van-popup>
  <!-- 个人简介 -->
  <van-cell
      :to="{path: '/account/profile', query: {data: userInfo.profile}}"
      is-link
      title="个人简介"
  >
    <template #value>
      <van-text-ellipsis :content="userInfo.profile || '未填写'" />
    </template>
  </van-cell>
  <!-- 手机 -->
  <van-cell
      :value="userInfo.phone"
      is-link
      title="手机"
      to="/account/phone"
  />
  <!-- 个人邮箱 -->
  <van-cell
      :to="{path: '/account/email', query: {data: userInfo.email}}"
      is-link
      title="邮箱"
  >
    <template #value>
      <van-text-ellipsis :content="userInfo.email || '未填写'" />
    </template>
  </van-cell>
  <!-- 账号密码 -->
  <van-cell
      :to="{path: '/account/password'}"
      is-link
      title="账号密码"
      value="修改"
  />
  <!-- 注册时间 -->
  <van-cell :value="userInfo.createTime" title="注册时间" />
  <!-- 退出登录 -->
  <van-col offset="1" span="22" style="margin-top: 16px">
    <van-button block plain type="danger" @click="handleLogout">
      退出登录
    </van-button>
  </van-col>
</template>
