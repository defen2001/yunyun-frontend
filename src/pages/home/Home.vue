<script lang="ts" setup>
import { recommendTeams } from '@/api/team.ts'
import { recommendUsers } from '@/api/user.ts'
import TeamCard from '@/components/TeamCard.vue'
import UserCard from '@/components/UserCard.vue'
import { Team } from '@/models/team'
import { User } from '@/models/user'
import { useMessageStore } from '@/store'
import { ref } from 'vue'

const userId = localStorage.getItem('userId')

const messageStore = useMessageStore()

/**
 * 推荐栏
 */
const activeTab = ref(0)

const users = {
  data: ref<User[]>([]),
  currentPage: ref(1),
  loading: ref(false),
  refreshing: ref(false),
  finished: ref(false),
  loadFunc: recommendUsers,
}

const teams = {
  data: ref<Team[]>([]),
  currentPage: ref(1),
  loading: ref(false),
  refreshing: ref(false),
  finished: ref(false),
  loadFunc: recommendTeams,
}

const onLoad = () => {
  let activeList = activeTab.value === 0 ? users : teams

  activeList.loadFunc(userId, activeList.currentPage.value).then((resp) => {
    if (activeList.currentPage.value === 1) {
      activeList.data.value = resp.data.data.records
    } else {
      activeList.data.value = [ ...activeList.data.value, ...resp.data.data.records ] as any
    }

    activeList.currentPage.value++
    activeList.loading.value = false
    activeList.refreshing.value = false
    activeList.finished.value = activeList.currentPage.value > resp.data.data.pages
  })
  messageStore.getUnreadMessageCount()
}

const onRefresh = () => {
  let activeList = activeTab.value === 0 ? users : teams
  activeList.currentPage.value = 1
  onLoad()
}
</script>

<template>
  <van-notice-bar
      v-if="messageStore.unreadMessageCount > 0"
      left-icon="warning-o"
      mode="link"
      @click="$router.push('/mine/message')"
  >
    您有 {{ messageStore.unreadMessageCount }} 条未读的消息
  </van-notice-bar>

  <van-tabs
      v-model:active="activeTab"
      animated
      lazy-render
      offset-top="46px"
      sticky
  >
    <van-tab v-for="activeList in [users, teams]">
      <template v-if="activeList === users" #title>
        <van-icon name="contact" />
        用户推荐
      </template>
      <template v-else #title>
        <van-icon name="friends-o" />
        队伍推荐
      </template>

      <van-pull-refresh
          v-model="activeList.refreshing.value"
          @refresh="onRefresh"
      >
        <van-list
            v-model:loading="activeList.loading.value"
            :finished="activeList.finished.value"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <UserCard
              v-for="user in users.data.value"
              v-if="activeList === users"
              :key="user.id"
              :user="user"
          />
          <TeamCard
              v-for="team in teams.data.value"
              v-else
              :key="team.id"
              :team="team"
          />
        </van-list>
      </van-pull-refresh>
    </van-tab>
  </van-tabs>
</template>
