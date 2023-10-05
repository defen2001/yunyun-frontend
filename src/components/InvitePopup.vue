<script lang="ts" setup>
import { sendTeamInvitation } from '@/api/team.ts'
import { queryByUsernameWithPagination } from '@/api/user.ts'
import UserCard from '@/components/UserCard.vue'
import { TeamInvitation } from '@/models/team'
import { User } from '@/models/user'
import QrcodeVue from 'qrcode.vue'
import { showNotify } from 'vant'
import { computed, ref, watch } from 'vue'
import useClipboard from 'vue-clipboard3'
import { useRouter } from 'vue-router'

const props = defineProps<{
  showInvitePopup: boolean
  teamId: string
  members: User[]
}>()

const emits = defineEmits<{
  (e: 'update:showInviteDialog', value: boolean): void
}>()

const showInvitePopup = ref(props.showInvitePopup)
watch(() => props.showInvitePopup, (value) => {
  showInvitePopup.value = value
})
watch(() => showInvitePopup.value, (value) => {
  emits('update:showInviteDialog', value)
})

const router = useRouter()

/**
 * 用户搜索
 */
const searchText = ref('')
const onSearch = () => {
  if (searchText.value === '') {
    showNotify({
      type: 'warning',
      message: '请输入要查询的用户名',
    })
    return
  }

  users.value = []
  currentPage.value = 1
  loading.value = true
  finished.value = false
  onLoad()
}

/**
 * 用户列表
 */
const users = ref<User[]>([])
const currentPage = ref(1)
const loading = ref(false)
const finished = ref(true)

const onLoad = () => {
  if (searchText.value === '') {
    return
  }
  queryByUsernameWithPagination(searchText.value, currentPage.value).then((resp) => {
    users.value = [ ...users.value, ...resp.data.data.records ]
    currentPage.value++
    loading.value = false
    finished.value = currentPage.value > resp.data.data.pages
  })
}

/**
 * 邀请用户加入
 */
const handleInvite = (userId: string) => {
  let teamInvitation = {
    teamId: props.teamId,
    invitee: userId,
  } as TeamInvitation
  sendTeamInvitation(teamInvitation).then((resp) => {
    InvitationCode.value = resp.data.data.invitationCode
    showInvitePopup.value = false
    showInviteInfo.value = true
  })
}

/**
 * 邀请信息弹窗
 */
const InvitationCode = ref('')
const showInviteInfo = ref(false)
const showQRCode = ref(false)

const acceptInviteRoute = router.getRoutes().find((route) => {
  return route.name === 'acceptInvite'
})
const InvitationLink = computed(() => {
  let pathPrefix = window.location.origin + acceptInviteRoute?.path.split(':')[0]
  return pathPrefix + InvitationCode.value
})

const shareOptions = [
  { name: '复制链接', icon: 'link' },
  { name: '二维码', icon: 'qrcode' },
]

const onSelectShareOption = (option: { name: string }) => {
  if (option.name === '复制链接') {
    let { toClipboard } = useClipboard()
    toClipboard(InvitationLink.value).then(() => {
      showNotify({
        type: 'success',
        message: '复制成功',
      })
    })
  } else if (option.name === '二维码') {
    showQRCode.value = true
  }
}
</script>

<template>
  <!-- 用户搜索弹窗 -->
  <van-popup
      v-model:show="showInvitePopup"
      position="bottom"
      round
      style="height: 80%"
  >
    <van-search
        v-model="searchText"
        placeholder="查询用户昵称"
        @search="onSearch"
    />
    <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
      <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
          atInvite
      >
        <!-- 邀请按钮 -->
        <template #right>
          <van-button
              :disabled="!!members.find(member => member.id === user.id)"
              icon="share-o"
              plain
              size="small"
              style="margin-left: 16px"
              text="邀请加入"
              type="success"
              @click="handleInvite(user.id)"
          />
        </template>
      </UserCard>
    </van-list>
  </van-popup>

  <!-- 邀请信息弹窗 -->
  <van-share-sheet
      v-model:show="showInviteInfo"
      :options="shareOptions"
      title="立即分享给好友"
      @select="onSelectShareOption"
  >
    <template #description>
      <div style="text-align: center">
        <p>对方的专属邀请码如下</p>
      </div>
      <van-password-input
          :mask="false"
          :value="InvitationCode"
          style="margin: 16px"
      />
    </template>
  </van-share-sheet>

  <!-- 二维码弹窗 -->
  <van-popup v-model:show="showQRCode" style="padding: 16px">
    <qrcode-vue :size="200" :value="InvitationLink" level="M" />
  </van-popup>
</template>
