<script lang="ts" setup>
import { User } from '@/models/user'

defineProps<{
  user: User,
  tags?: string[],
  isLeader?: boolean
  atInvite?: boolean
}>()
</script>

<template>
  <van-cell
      :border="false"
      :is-link="!atInvite"
      :to="atInvite ? undefined : `/user/${user.id}`"
      center
  >
    <template #title>
      <!-- 用户卡片 -->
      <van-row :wrap="false" align="center">
        <!-- 左侧头像 -->
        <van-col>
          <van-image
              :src="user.avatarUrl"
              fit="cover"
              height="60px"
              round
              width="60px"
          />
        </van-col>
        <!-- 右侧信息 -->
        <van-col offset="1">
          <!-- 昵称 -->
          <div class="username">{{ user.username || user.account }}</div>
          <!-- 简介 -->
          <div class="profile">{{ user.profile }}</div>
          <!-- 标签 -->
          <van-space v-if="!atInvite" :size="5" wrap>
            <van-tag v-if="isLeader" color="#7232dd" plain size="medium">
              <van-icon name="manager" style="margin-right: 3px" />
              队长
            </van-tag>
            <van-tag
                v-for="tag in user.tags"
                :type="tags?.includes(tag) ? 'success' : 'primary'"
                plain
                size="medium"
            >
              {{ tag }}
            </van-tag>
          </van-space>
        </van-col>
      </van-row>
    </template>
    <!-- 右侧内容 -->
    <template v-if="atInvite" #extra>
      <slot name="right" />
    </template>
  </van-cell>
</template>

<style scoped>
.username {
  line-height: 18px;
}

.profile {
  font-size: 10px;
  line-height: 18px;
  color: #969799;
}
</style>
