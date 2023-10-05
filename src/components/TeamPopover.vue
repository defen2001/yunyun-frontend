<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

/**
 * 弹出菜单
 */
const actions = [
  { text: '创建队伍', icon: 'plus' },
  { text: '邀请码', icon: 'coupon-o' },
]

const onSelectAction = (action: { text: string }) => {
  if (action.text === '创建队伍') {
    router.push('/team/create')
  } else if (action.text === '邀请码') {
    showDialog.value = true
  }
}

/**
 * 邀请码
 */
const showDialog = ref(false)
const showKeyboard = ref(false)
const InvitationCode = ref('')
</script>

<template>
  <!-- 弹出菜单 -->
  <van-popover
      :actions="actions"
      :show-arrow="false"
      placement="bottom-end"
      @select="onSelectAction"
  >
    <template #reference>
      <van-icon name="ellipsis" size="18" />
    </template>
  </van-popover>

  <!-- 邀请码弹窗 -->
  <van-dialog
      v-model:show="showDialog"
      show-cancel-button
      teleport="body"
      title="请填写您的邀请码"
      z-index="1"
      @confirm="router.push('/team/invite/' + InvitationCode)"
  >
    <van-password-input
        :focused="showKeyboard"
        :mask="false"
        :value="InvitationCode"
        style="margin: 16px"
        @focus="showKeyboard = true"
    />
  </van-dialog>

  <!-- 数字键盘 -->
  <van-number-keyboard
      v-model="InvitationCode"
      :show="showKeyboard"
      teleport="body"
      @blur="showKeyboard = false"
  />
</template>
