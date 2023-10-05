<script lang="ts" setup>
import { listMyTeamInfo } from '@/api/team.ts'
import { getAccountInfo } from '@/api/user.ts'
import { Team } from '@/models/team'
import { User } from '@/models/user'
import { useMessageStore } from '@/store'
import { onMounted, ref } from 'vue'

const isLogin = localStorage.getItem('token')

const messageStore = useMessageStore()

/**
 * 用户信息
 */
const userInfo = ref<User>({} as User)
const ownedTeams = ref<Team[]>([])
const joinedTeams = ref<Team[]>([])

onMounted(() => {
  if (!isLogin) {
    return
  }

  getAccountInfo().then((resp) => {
    userInfo.value = resp.data.data
    listMyTeamInfo().then((resp) => {
      let teamList = resp.data.data
      ownedTeams.value = teamList.filter((team: Team) => {
        return team.leader.id === userInfo.value.id
      })
      joinedTeams.value = teamList.filter((team: Team) => {
        return team.leader.id !== userInfo.value.id
      })
    })
  })
  messageStore.getUnreadMessageCount()
})
</script>

<template>
  <!-- 登录按钮 -->
  <template v-if="!isLogin">
    <van-col offset="1" span="22" style="margin-top: 16px">
      <van-button
          block
          icon="contact"
          type="primary"
          @click="$router.push('/login')"
      >
        暂未登录，去登录
      </van-button>
    </van-col>
  </template>

  <!-- 用户信息 -->
  <UserInfo
      v-else
      :joinedTeams="joinedTeams"
      :ownedTeams="ownedTeams"
      :userInfo="userInfo"
      atMinePage
  />
</template>
