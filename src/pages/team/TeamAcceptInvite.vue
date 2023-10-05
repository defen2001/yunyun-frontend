<script lang="ts" setup>
import { acceptTeamInvitation } from '@/api/team.ts'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ code: string }>()

const router = useRouter()

onMounted(() => {
  if (!props.code) {
    router.push('/home')
    return
  }
  acceptTeamInvitation(props.code).then(() => {
    router.push('/mine')
  }).catch(() => {
    router.push('/home')
  })
})
</script>
