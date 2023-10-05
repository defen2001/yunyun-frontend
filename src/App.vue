<script lang="ts" setup>
import TeamPopover from '@/components/TeamPopover.vue'
import { useMessageStore } from '@/store'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = computed(() => router.currentRoute.value.meta.title)

const tabBarPaths = [ '/home', '/team', '/mine' ]

const handleNavRightClick = () => {
  const navMap: { [key: string]: string } = {
    '/home': '/search',
    '/mine': '/mine/message',
  }
  if (router.currentRoute.value.path !== '/team') {
    router.push(navMap[router.currentRoute.value.path])
  }
}

const messageStore = useMessageStore()
</script>

<template>
  <!-- 导航栏 -->
  <van-nav-bar
      :left-arrow="!tabBarPaths.includes($route.path)"
      :title="title"
      fixed
      placeholder
      @click-left="router.back()"
      @click-right="handleNavRightClick"
  >
    <template #right>
      <van-icon v-if="$route.path === '/home'" name="search" size="18" />
      <TeamPopover v-if="$route.path === '/team'" />
      <van-badge
          v-if="$route.path === '/mine'"
          :content="messageStore.unreadMessageCount"
          :show-zero="false"
      >
        <van-icon name="envelop-o" size="18" />
      </van-badge>
    </template>
  </van-nav-bar>

  <RouterView />
</template>
