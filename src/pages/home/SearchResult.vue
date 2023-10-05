<script lang="ts" setup>
import { queryByTagsWithPagination } from '@/api/user.ts'
import UserCard from '@/components/UserCard.vue'
import { User } from '@/models/user'
import { ref } from 'vue'

const props = defineProps<{ tags: string }>()

const tags = props.tags.split(',')

/**
 * 用户列表
 */
const users = ref<User[]>([])
const currentPage = ref(1)
const loading = ref(false)
const finished = ref(false)

const onLoad = () => {
  queryByTagsWithPagination(props.tags, currentPage.value).then((resp) => {
    // 将搜索的标签置顶
    resp.data.data.records.forEach((user) => {
      user.tags.sort((a, b) => {
        if (tags.includes(a) && tags.includes(b)) {
          return tags.indexOf(a) - tags.indexOf(b)
        } else if (tags.includes(a)) {
          return -1
        } else if (tags.includes(b)) {
          return 1
        } else {
          return 0
        }
      })
    })

    users.value = [ ...users.value, ...resp.data.data.records ]
    currentPage.value++
    loading.value = false
    finished.value = currentPage.value > resp.data.data.pages
  })
}
</script>

<template>
  <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
  >
    <UserCard
        v-for="user in users"
        :key="user.id"
        :tags="tags"
        :user="user"
    />
  </van-list>
</template>
