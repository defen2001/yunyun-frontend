<script lang="ts" setup>
import { getAccountInfo, queryHotTags } from '@/api/user.ts'
import { showNotify } from 'vant'
import { computed, onMounted, ref } from 'vue'

const props = defineProps<{
  type: 'search' | 'edit'
}>()

const emits = defineEmits<{
  (e: 'click:button', selectedTags: string[]): void
}>()

/**
 * 标签
 */
const commonTags = [
  {
    category: '编程语言',
    tags: [ 'C', 'C++', 'Java', 'Python', 'Rust', 'Go', 'HTML', 'CSS', 'JavaScript' ],
  },
  {
    category: '数据库',
    tags: [ 'MySQL', 'Redis', 'MongoDB', 'SQLite', 'PostgreSQL', 'Elasticsearch' ],
  },
  {
    category: '框架',
    tags: [ 'Spring', 'SpringMVC', 'SpringBoot', 'Vue', 'React', 'Django', 'Flask' ],
  },
  {
    category: '工具',
    tags: [ 'Git', 'GitHub', 'Docker', 'Kubernetes', 'Jenkins', 'Maven', 'Gradle' ],
  },
  {
    category: '方向',
    tags: [ '后端', '前端', '测试', '运维', '大数据', '人工智能', '机器学习' ],
  },
]

const hotTags = ref<string[]>([])
onMounted(() => {
  queryHotTags().then((resp) => {
    hotTags.value = resp.data.data
  })
  if (props.type === 'edit') {
    getAccountInfo().then((resp) => {
      selectedTags.value = resp.data.data.tags || []
    })
  }
})

const selectedTags = ref<string[]>([])

const handleClickTag = (tagName: string) => {
  if (selectedTags.value.includes(tagName)) {
    handleRemoveTag(tagName)
  } else {
    handleAddTag(tagName)
  }
}

const handleAddTag = (tagName: string) => {
  if (selectedTags.value.length >= 10) {
    showNotify({ type: 'warning', message: '最多选择 10 个标签' })
    return
  }
  selectedTags.value.push(tagName)
}

const handleRemoveTag = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter((name) => name !== tagName)
}

/**
 * 标签筛选
 */
const filterTagText = ref('')

const displayedTags = computed(() => {
  const filterText = filterTagText.value.trim()
  // 关键词为空时返回所有标签
  if (!filterText) {
    return commonTags
  }
  // 返回匹配的标签类别或标签名称
  return commonTags
      .map((commonTag) => {
        if (commonTag.category.includes(filterText)) {
          return commonTag
        }
        return {
          category: commonTag.category,
          tags: commonTag.tags.filter((tagName: string) =>
              tagName.includes(filterText),
          ),
        }
      })
      .filter((commonTag) => commonTag.tags.length > 0)
})

/**
 * 折叠面板
 */
const activeCollapseNames = ref(commonTags.map((commonTag) => commonTag.category))
</script>

<template>
  <!-- 悬浮按钮 -->
  <van-floating-bubble
      :icon="type === 'search' ? 'search' : 'success'"
      axis="lock"
      @click="emits('click:button', selectedTags)"
  />

  <!-- 标签筛选框 -->
  <van-search
      v-model="filterTagText"
      :show-action="displayedTags.length === 0"
      left-icon="filter-o"
      placeholder="输入关键词筛选标签"
  >
    <template #action>
      <van-button
          :disabled="selectedTags.includes(filterTagText)"
          block
          icon="plus"
          plain
          size="small"
          text="自定义"
          type="primary"
          @click="handleAddTag(filterTagText)"
      />
    </template>
  </van-search>

  <!-- 已选标签 -->
  <template v-if="selectedTags.length > 0">
    <van-cell-group
        :border="false"
        :title="type === 'search' ? '搜索标签' : '我的标签'"
    >
      <van-space style="padding: 0 16px" wrap>
        <van-tag
            v-for="tagName in selectedTags"
            closeable
            size="large"
            type="primary"
            @close="handleRemoveTag(tagName)"
        >
          {{ tagName }}
        </van-tag>
      </van-space>
    </van-cell-group>
  </template>

  <!-- 热门标签 -->
  <van-cell-group v-if="hotTags.length !== 0" :border="false" title="热门标签">
    <van-space style="padding: 0 16px" wrap>
      <van-tag
          v-for="tagName in hotTags"
          :plain="!selectedTags.includes(tagName)"
          size="large"
          type="warning"
          @click="handleClickTag(tagName)"
      >
        <van-icon name="fire" style="margin-right: 3px" />
        {{ tagName }}
      </van-tag>
    </van-space>
  </van-cell-group>

  <!-- 常用标签 -->
  <van-cell-group :border="false" title="常用标签">
    <van-collapse v-model="activeCollapseNames" :border="false">
      <van-collapse-item
          v-for="displayedTag in displayedTags"
          :name="displayedTag.category"
          :title="displayedTag.category"
      >
        <template #value>
          已选 {{
            displayedTag.tags.filter((tagName: string) => {
              return selectedTags.includes(tagName)
            }).length
          }}
        </template>
        <van-space wrap>
          <van-tag
              v-for="tagName in displayedTag.tags"
              :plain="!selectedTags.includes(tagName)"
              size="large"
              type="primary"
              @click="handleClickTag(tagName)"
          >
            {{ tagName }}
          </van-tag>
        </van-space>
      </van-collapse-item>
    </van-collapse>

    <!-- 空筛选结果提示 -->
    <van-empty
        v-show="displayedTags.length === 0"
        description="暂无相关标签"
        image="search"
    />
  </van-cell-group>
</template>
