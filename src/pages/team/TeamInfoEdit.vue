<script lang="ts" setup>
import { addTeam, queryByTeamId, updateTeamInfo } from '@/api/team.ts'
import { Team } from '@/models/team'
import { DateUtil } from '@/utils/dateUtil.ts'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  teamId: string | null,
  type: 'create' | 'edit'
}>()

const router = useRouter()

/**
 * 队伍信息
 */
const teamInfo = ref<Team>({} as Team)
onMounted(() => {
  // 若当前为编辑队伍信息页面
  if (props.type === 'edit' && props.teamId) {
    queryByTeamId(props.teamId).then((resp) => {
      let tempTeamInfo = resp.data.data
      // 若队伍不存在或当前用户非队长则返回上一页
      if (!tempTeamInfo?.id ||
          tempTeamInfo.leader.id != localStorage.getItem('userId')) {
        router.back()
        return
      }
      teamInfo.value = tempTeamInfo
    })
  }
})

const teamNameValidator = [
  { required: true, message: '队伍名称不能为空' },
  {
    pattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,10}$/,
    message: '名称应为 2~10 位的中英文或数字',
  },
]

const selectedDateString = computed(() => {
  if (teamInfo.value.expireTime) {
    return teamInfo.value.expireTime.slice(0, 10)
  } else {
    return '永不过期'
  }
})

/**
 * 过期时间选择器
 */
const showCalendar = ref(false)
const onCalendarConfirm = (date: Date) => {
  let datetimeStr = DateUtil.format(date)
  if (datetimeStr === teamInfo.value.expireTime) {
    teamInfo.value.expireTime = ''
  } else {
    teamInfo.value.expireTime = datetimeStr
  }
  showCalendar.value = false
}

/**
 * 创建队伍或修改队伍信息
 */
const handleSubmit = () => {
  if (props.type === 'create') {
    addTeam(teamInfo.value)
    router.back()
  } else {
    updateTeamInfo(teamInfo.value)
    router.back()
  }
}
</script>

<template>
  <van-form
      error-message-align="right"
      input-align="right"
      @submit="handleSubmit"
  >
    <van-cell-group inset>
      <!-- 队伍名称 -->
      <van-field
          v-model="teamInfo.name"
          :rules="teamNameValidator"
          label="队伍名称"
          placeholder="请填写队伍名称"
          style="margin-top: 16px"
      />
      <!-- 队伍描述 -->
      <van-field
          v-model="teamInfo.description"
          autosize
          label="队伍描述"
          maxlength="50"
          placeholder="队伍的描述信息 (可选)"
          rows="1"
          type="textarea"
      />
      <!-- 队伍类型 -->
      <van-cell
          center
          label="队伍公开后对任何人可见"
          title="是否公开"
      >
        <template #right-icon>
          <van-switch
              v-model="teamInfo.type"
              :active-value="0"
              :inactive-value="1"
          />
        </template>
      </van-cell>
      <!-- 入队密码 -->
      <transition name="van-slide-up">
        <van-field
            v-if="teamInfo.type === 0"
            v-model="teamInfo.password"
            :placeholder="teamInfo.hasPassword ? '•••••••••' : '填写后加入需要密码'"
            label="入队密码"
            type="password"
        />
      </transition>
      <!-- 人数限制 -->
      <van-cell
          center
          label="队伍人数在 2~10 人之间"
          title="人数限制"
      >
        <template #right-icon>
          <van-stepper
              v-model="teamInfo.memberLimit"
              button-size="32px"
              integer
              max="10"
              min="2"
          />
        </template>
      </van-cell>
      <!-- 过期时间 -->
      <van-cell
          :value="selectedDateString"
          center
          is-link
          label="队伍过期后将无法加入"
          title="过期时间"
          @click="showCalendar = true"
      />
      <van-calendar
          v-model:show="showCalendar"
          :show-confirm="false"
          title="设置过期时间"
          @confirm="onCalendarConfirm"
      />
      <!-- 提交按钮 -->
      <van-button
          block
          native-type="submit"
          style="margin-top: 16px"
          type="primary"
      >
        {{ props.type === 'create' ? '创建队伍' : '修改信息' }}
      </van-button>
    </van-cell-group>
  </van-form>
</template>
