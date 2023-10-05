<script lang="ts" setup>
import { getMessageWithScrolling, queryByUserId } from '@/api/user.ts'
import { Message } from '@/models/message'
import { User } from '@/models/user'
import { DateUtil } from '@/utils/dateUtil.ts'
import { ref } from 'vue'

/**
 * 消息列表
 */
const messages = ref<Message[]>([])
const senderMap = ref<{ [id: string]: User }>({})
const scrollId = ref()
const loading = ref(false)
const finished = ref(false)

const onLoad = () => {
  getMessageWithScrolling(scrollId.value).then((resp) => {
    let data = resp.data.data
    messages.value = [ ...messages.value, ...data ]
    for (let message of data) {
      if (!senderMap.value[message.senderId]) {
        queryByUserId(message.senderId).then((resp) => {
          senderMap.value[message.senderId] = resp.data.data
        })
      }
    }
    loading.value = false
    finished.value = data.length < 10
    scrollId.value = messages.value[messages.value.length - 1].scrollId
  })
}

const getSendTimeStr = (sendTime: string) => {
  let beginTime = new Date(sendTime)
  let endTime = new Date()
  if (beginTime.getDate() === endTime.getDate()) {
    return sendTime.split(' ')[1].slice(0, 5)
  }
  return DateUtil.formatTimeDiff(beginTime, endTime) + '前'
}
</script>

<template>
  <van-cell-group>
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <van-cell
          v-for="message in messages"
          :key="message.scrollId"
          :title="message.content"
      >
        <template #label>
          <van-row align="center" justify="space-between">
            <div class="userInfo">
              <van-image
                  :src="senderMap[message.senderId]?.avatarUrl"
                  fit="cover"
                  height="24px"
                  round
                  width="24px"
              />
              <span style="margin-left: 6px">
              {{ senderMap[message.senderId]?.username || senderMap[message.senderId]?.account }}
            </span>
            </div>
            <span>
              {{ getSendTimeStr(message.sendTime) }}
            </span>
          </van-row>
        </template>
        <template v-if="message.isUnread" #extra>
          <van-badge dot position="bottom-right" />
        </template>
      </van-cell>
    </van-list>
  </van-cell-group>
</template>

<style scoped>
.userInfo {
  display: flex;
  align-items: center;
}
</style>
