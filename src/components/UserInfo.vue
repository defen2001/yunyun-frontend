<script lang="ts" setup>
import TeamCard from '@/components/TeamCard.vue'
import { Team } from '@/models/team'
import { User } from '@/models/user'
import { computed, ref } from 'vue'

const props = defineProps<{
  userInfo: User,
  ownedTeams: Team[],
  joinedTeams: Team[],
  atMinePage?: boolean,
  cardValue?: string
}>()

const pronouns = computed(() => {
  return props?.atMinePage ? '我' :
      props.userInfo.gender === 1 ? '他' :
          props.userInfo.gender === 2 ? '她' :
              'TA '
})

const activeTab = ref(0)
</script>

<template>
  <!-- 用户基本信息 -->
  <van-cell
      :is-link="atMinePage"
      :label="userInfo.profile || '暂无个人简介'"
      :title="userInfo.username || userInfo.account"
      :to="atMinePage ? '/account' : undefined"
      :value="cardValue"
      center
  >
    <template #icon>
      <van-image
          :src="userInfo.avatarUrl"
          fit="cover"
          height="80px"
          round
          style="margin-right: 10px"
          width="80px"
      />
    </template>
  </van-cell>

  <!-- 用户标签 -->
  <van-cell-group :border="false" :title="`${pronouns}的标签`">
    <van-space :size="5" style="padding: 0 16px" wrap>
      <van-tag
          v-if="userInfo.gender !== 0"
          :color="userInfo.gender === 1 ? '#3bb' : '#f99'"
          plain
          size="large"
      >
        {{ userInfo.gender === 1 ? '男' : '女' }}
      </van-tag>
      <van-tag
          v-for="tag in userInfo.tags"
          plain
          size="large"
          type="primary"
      >
        {{ tag }}
      </van-tag>
      <van-tag
          v-if="atMinePage"
          size="large"
          type="primary"
          @click="$router.push('/account/tags')"
      >
        <van-icon name="plus" style="margin-right: 3px" />
        添加标签
      </van-tag>
    </van-space>
  </van-cell-group>

  <van-tabs
      v-model:active="activeTab"
      animated
      offset-top="46px"
      sticky
  >
    <!-- 加入的队伍 -->
    <van-tab>
      <template #title>
        <van-icon name="friends-o" />
        加入的队伍
      </template>
      <TeamCard
          v-for="joinedTeam in joinedTeams"
          :key="joinedTeam.id"
          :team="joinedTeam"
      />
      <van-empty
          v-if="!joinedTeams.length"
          description="暂无加入的队伍"
          image="search"
      />
    </van-tab>
    <!-- 创建的队伍 -->
    <van-tab>
      <template #title>
        <van-icon name="manager-o" />
        创建的队伍
      </template>
      <TeamCard
          v-for="ownedTeam in ownedTeams"
          :key="ownedTeam.id"
          :team="ownedTeam"
      />
      <van-empty
          v-if="!ownedTeams.length"
          description="暂无创建的队伍"
          image="search"
      />
    </van-tab>
  </van-tabs>
</template>
