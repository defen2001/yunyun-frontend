<script lang="ts" setup>
import { queryByConditionWithPagination } from '@/api/team.ts'
import TeamCard from '@/components/TeamCard.vue'
import { Team, TeamQuery } from '@/models/team'
import { ref } from 'vue'

/**
 * 队伍搜索
 */
const teamQuery = ref<TeamQuery>({ currentPage: 1 } as TeamQuery)
const handleSearch = () => {
  teams.value = []
  teamQuery.value.currentPage = 1
  loading.value = true
  finished.value = false
  onLoad()
}

/**
 * 队伍列表
 */
const teams = ref<Team[]>([])
const loading = ref(false)
const finished = ref(false)
const onLoad = () => {
  queryByConditionWithPagination(teamQuery.value).then((resp) => {
    teams.value = [ ...teams.value, ...resp.data.data.records ]
    teamQuery.value.currentPage++
    loading.value = false
    finished.value = teamQuery.value.currentPage > resp.data.data.pages
  })
}
</script>

<template>
  <!-- 队伍搜索 -->
  <van-search
      v-model="teamQuery.searchText"
      placeholder="请输入搜索关键词"
      @search="handleSearch"
  />
  <van-cell center title="仅搜索未设置密码的队伍">
    <template #right-icon>
      <van-switch v-model="teamQuery.onlyNoPassword" size="18px" />
    </template>
  </van-cell>

  <!-- 队伍列表 -->
  <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
  >
    <TeamCard
        v-for="team in teams"
        :key="team.id"
        :team="team"
    />
  </van-list>

  <!-- 回到顶部 -->
  <van-back-top bottom="80px" />
</template>
