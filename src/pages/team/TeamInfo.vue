<script lang="ts" setup>
import { joinPublicTeam, listTeamMember, queryByTeamId, quitOrDisbandTeam } from '@/api/team.ts'
import InvitePopup from '@/components/InvitePopup.vue'
import TeamTags from '@/components/TeamTags.vue'
import UserCard from '@/components/UserCard.vue'
import { Team } from '@/models/team'
import { User } from '@/models/user'
import { showConfirmDialog } from 'vant'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ teamId: string }>()

const router = useRouter()

/**
 * 队伍信息
 */
const teamInfo = ref<Team>({} as Team)
const members = ref<User[]>([])

/**
 * 当前用户信息
 */
const currentUserId = localStorage.getItem('userId')
const isLeader = ref(false)

onMounted(() => {
  queryByTeamId(props.teamId).then((resp) => {
    teamInfo.value = resp.data.data
    isLeader.value = teamInfo.value.leader.id === currentUserId
    listTeamMember(props.teamId).then((resp) => {
      let data = resp.data.data
      let leaderId = teamInfo.value.leader.id
      data.sort((a, b) =>
          (a.id === leaderId) ? -1 :
              (b.id === leaderId) ? 1 :
                  0)
      members.value = data
    })
  })
})

/**
 * 入队密码
 */
const showPasswordDialog = ref(false)
const password = ref('')

/**
 * 邀请面板
 */
const showInvitePopup = ref(false)
const handleShowInviteDialogChange = (value: boolean) => {
  showInvitePopup.value = value
}

/**
 * 编辑队伍信息事件
 */
const handleEdit = () => {
  router.push(`/team/edit/${props.teamId}`)
}

/**
 * 退出或解散队伍事件
 */
const handleQuitOrDisband = () => {
  let title = isLeader.value ? '解散队伍' : '退出队伍'
  let message = isLeader.value ? '此操作不可逆，确认要解散队伍吗？' : '确认要退出队伍吗？'

  showConfirmDialog({
    title: title,
    message: message,
  }).then(() => {
    quitOrDisbandTeam(props.teamId).then(() => {
      router.back()
    })
  }).catch()
}

/**
 * 加入队伍事件
 */
const handleJoin = () => {
  if (teamInfo.value.hasPassword && !password.value) {
    showPasswordDialog.value = true
    return
  }

  joinPublicTeam(props.teamId, password.value).then(() => {
    queryByTeamId(props.teamId).then((resp) => {
      teamInfo.value = resp.data.data
    })
    listTeamMember(props.teamId).then((resp) => {
      members.value = resp.data.data
    })
  })
}
</script>

<template>
  <van-cell-group :border="false" title="队伍信息">
    <!-- 队伍信息 -->
    <van-cell :value="teamInfo.name" title="队伍名称" />
    <van-cell :value="teamInfo.description || '暂未设置队伍描述'" title="队伍描述" />
    <van-cell>
      <template #title>
        <TeamTags :team="teamInfo" />
      </template>
    </van-cell>

    <!-- 操作按钮 -->
    <van-cell>
      <template #title>
        <van-space v-if="isLeader">
          <van-button
              icon="edit"
              plain
              size="small"
              type="primary"
              @click="handleEdit"
          >
            编辑队伍信息
          </van-button>
          <van-button
              icon="share-o"
              plain
              size="small"
              type="success"
              @click="showInvitePopup = true"
          >
            邀请他人加入
          </van-button>
          <van-button
              icon="delete-o"
              plain
              size="small"
              type="danger"
              @click="handleQuitOrDisband"
          >
            解散队伍
          </van-button>
        </van-space>
        <van-button
            v-else-if="members.find(member => member.id === currentUserId)"
            icon="revoke"
            plain
            size="small"
            type="danger"
            @click="handleQuitOrDisband"
        >
          退出队伍
        </van-button>
        <van-button
            v-else
            icon="plus"
            plain
            size="small"
            type="success"
            @click="handleJoin"
        >
          加入队伍
        </van-button>
      </template>
    </van-cell>
  </van-cell-group>

  <!-- 成员信息 -->
  <van-cell-group :border="false" title="成员信息">
    <UserCard
        v-for="member in members"
        :key="member.id"
        :isLeader="member.id === teamInfo.leader.id"
        :user="member"
    />
  </van-cell-group>

  <!-- 填写入队密码弹窗 -->
  <van-dialog
      v-model:show="showPasswordDialog"
      show-cancel-button
      title="该队伍已设置密码"
      @close="password = ''"
      @confirm="handleJoin"
  >
    <van-field
        v-model="password"
        input-align="right"
        label="密码"
        placeholder="请填写入队密码"
        style="width: 90%; margin: 5%"
        type="password"
    />
  </van-dialog>

  <!-- 邀请弹窗 -->
  <InvitePopup
      :members="members"
      :showInvitePopup="showInvitePopup"
      :teamId="props.teamId"
      @update:showInviteDialog="handleShowInviteDialogChange"
  />
</template>
