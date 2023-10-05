<script lang="ts" setup>
import { Team } from '@/models/team'
import { DateUtil } from '@/utils/dateUtil.ts'
import { computed } from 'vue'

const props = defineProps<{
  team: Team,
  showLeader?: boolean
}>()

const timeDiff = computed(() => {
  return DateUtil.formatTimeDiff(
      new Date(),
      new Date(props.team.expireTime),
  )
})
</script>

<template>
  <van-space size="5px" wrap>
    <van-tag v-if="showLeader" color="#7232dd" plain size="medium">
      <van-icon name="manager" style="margin-right: 3px" />
      {{ team.leader.username }}
    </van-tag>
    <van-tag v-if="team.type === 0" size="medium" type="success">
      <van-icon name="eye-o" style="margin-right: 3px" />
      公开
    </van-tag>
    <van-tag v-if="team.type === 1" size="medium" type="danger">
      <van-icon name="closed-eye" style="margin-right: 3px" />
      私密
    </van-tag>
    <van-tag v-if="team.hasPassword" size="medium" type="warning">
      <van-icon name="warning-o" style="margin-right: 3px" />
      需密码
    </van-tag>
    <van-tag size="medium" type="primary">
      <van-icon name="contact" style="margin-right: 3px" />
      {{ team.memberCount }} / {{ team.memberLimit }}
    </van-tag>
    <van-tag v-if="team.expireTime" plain size="medium">
      <van-icon name="clock-o" style="margin-right: 3px" />
      {{ timeDiff ? timeDiff + '后过期' : '已过期' }}
    </van-tag>
  </van-space>
</template>
