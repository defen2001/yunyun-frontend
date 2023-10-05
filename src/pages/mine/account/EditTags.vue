<script lang="ts" setup>
import { updateTags } from '@/api/user.ts'
import TagSelector from '@/components/TagSelector.vue'

/**
 * 更新标签
 */
const handleUpdateTags = (selectedTags: string[]) => {
  updateTags(selectedTags)
}
</script>

<template>
  <TagSelector type="edit" @click:button="handleUpdateTags" />
</template>
