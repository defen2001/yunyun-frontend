<script lang="ts" setup>
import { listTeamInfoByUserId } from '@/api/team.ts'
import { queryByUserId } from '@/api/user.ts'
import { Team } from '@/models/team'
import { User } from '@/models/user'
import { DateUtil } from '@/utils/dateUtil.ts'
import { onMounted, ref } from 'vue'

const props = defineProps<{ userId: string }>()

/**
 * 用户信息
 */
const userInfo = ref<User>({} as User)
const ownedTeams = ref<Team[]>([])
const joinedTeams = ref<Team[]>([])

onMounted(() => {
  queryByUserId(props.userId).then((resp) => {
    userInfo.value = resp.data.data
  })
  listTeamInfoByUserId(props.userId).then((resp) => {
    let teamList = resp.data.data
    ownedTeams.value = teamList.filter((team: Team) => {
      return team.leader.id === props.userId
    })
    joinedTeams.value = teamList.filter((team: Team) => {
      return team.leader.id !== props.userId
    })
  })
})
</script>

<template>
  <UserInfo
      :cardValue="'已加入 ' + DateUtil.formatTimeDiff(new Date(userInfo.createTime), new Date())"
      :joinedTeams="joinedTeams"
      :ownedTeams="ownedTeams"
      :userInfo="userInfo"
  />
</template>
