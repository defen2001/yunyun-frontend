<script lang="ts" setup>
import TagSelector from '@/components/TagSelector.vue'
import { showNotify } from 'vant'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 搜索
 */
const handleSearch = (selectedTags: string[]) => {
  if (selectedTags.length === 0) {
    showNotify({ type: 'warning', message: '请选择要查询的标签' })
    return
  }
  router.push({
    path: '/search/result',
    query: { tags: selectedTags.join(',') },
  })
}
</script>

<template>
  <TagSelector type="search" @click:button="handleSearch" />
</template>
