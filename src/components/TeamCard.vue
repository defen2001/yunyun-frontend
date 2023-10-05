<script lang="ts" setup>
import TeamTags from '@/components/TeamTags.vue'
import { Team } from '@/models/team'

defineProps<{ team: Team }>()
</script>

<template>
  <van-cell
      :border="false"
      :is-link="true"
      :to="`/team/${team.id}`"
      center
  >
    <!-- 队伍名称及描述 -->
    <template #title>
      <div class="name">{{ team.name }}</div>
      <div class="description">{{ team.description }}</div>
    </template>
    <!-- 队伍其他信息 -->
    <template #label>
      <TeamTags :team="team" showLeader />
    </template>
  </van-cell>
</template>

<style scoped>
.name {
  line-height: 18px;
}

.description {
  font-size: 10px;
  line-height: 18px;
  margin: 5px 0 6px 0;
  color: #969799;
}
</style>
