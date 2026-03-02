<script setup lang="ts">
import {
  SearchOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  InfoCircleOutlined,
  SwapOutlined,
} from '@ant-design/icons-vue';
import { TRIGGER_NODE_TYPES } from '~/config/triggerNodeTypes';
import { WorkflowNodeKind } from '~/types/workflow';
import { useSharedActionNodeTypeSelector } from '~/composables/workflow/useSharedActionNodeTypeSelector';

defineProps<{
  nodeKind: WorkflowNodeKind;
}>();

const emit = defineEmits<{
  menuAction: [key: string];
}>();

const {
  actionSearch,
  activeActionCategory,
  filteredActionNodeTypes,
  groupedActionNodeTypes,
  actionNodeCategoryTabs,
} = useSharedActionNodeTypeSelector();

function onMenuClick(info: { key: string }) {
  emit('menuAction', info.key);
}
</script>

<template>
  <a-dropdown placement="bottomRight">
    <a-button type="text" class="node-action nodrag nopan">
      <template #icon>
        <EllipsisOutlined />
      </template>
    </a-button>
    <template #overlay>
      <a-menu
        class="node-dropdown-menu nodrag nopan"
        :trigger-sub-menu-action="'hover'"
        @click="onMenuClick"
      >
        <a-menu-item key="rename-node" title="Rename Node">
          <a>Rename Node</a>
          <template #icon>
            <EditOutlined />
          </template>
        </a-menu-item>
        <a-sub-menu
          v-if="nodeKind === WorkflowNodeKind.Trigger"
          key="change-node-type-trigger"
          title="Change Node Type"
        >
          <template #icon>
            <SwapOutlined />
          </template>
          <a-menu-item
            v-for="triggerType in TRIGGER_NODE_TYPES"
            :key="`trigger-type:${triggerType.key}`"
          >
            <template #icon>
              <span
                class="trigger-type-icon"
                :style="{
                  backgroundColor: triggerType.iconColor,
                  borderRadius: '3px',
                }"
              >
                <component :is="triggerType.icon" :style="{ color: 'white' }" />
              </span>
            </template>
            {{ triggerType.label }}
            <template v-if="triggerType.isComingSoon">
              <a-tag color="blue" v-if="triggerType.isComingSoon"
                >Coming Soon</a-tag
              >
            </template>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu
          v-else-if="nodeKind === WorkflowNodeKind.Action"
          key="change-node-type-action"
          title="Change Node Type"
        >
          <template #icon>
            <SwapOutlined />
          </template>

          <a-menu-item
            key="action-node-search"
            disabled
            class="action-submenu-static"
            @click.stop
          >
            <a-input
              v-model:value="actionSearch"
              class="action-search"
              placeholder="Search"
              allow-clear
              @click.stop
              @keydown.stop
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
          </a-menu-item>

          <a-menu-item
            key="action-node-tabs"
            disabled
            class="action-submenu-static tabs-item"
            @click.stop
          >
            <a-tabs
              v-model:activeKey="activeActionCategory"
              size="small"
              @click.stop
            >
              <a-tab-pane
                v-for="category in actionNodeCategoryTabs"
                :key="category.key"
                :tab="category.label"
              />
            </a-tabs>
          </a-menu-item>

          <template v-if="activeActionCategory === 'all'">
            <a-menu-item-group
              v-for="group in groupedActionNodeTypes"
              :key="`action-group:${group.category}`"
              class="action-group"
            >
              <template #title>
                <span class="action-group-title">{{ group.label }}</span>
              </template>
              <a-menu-item
                v-for="actionType in group.items"
                :key="`action-type:${actionType.key}`"
              >
                <template #icon>
                  <span
                    class="trigger-type-icon"
                    :style="{ backgroundColor: actionType.iconColor }"
                  >
                    <component
                      :is="actionType.icon"
                      :style="{ color: 'white' }"
                    />
                  </span>
                </template>
                {{ actionType.label }}
                <template v-if="actionType.isComingSoon">
                  <a-tag color="blue" v-if="actionType.isComingSoon"
                    >Coming Soon</a-tag
                  >
                </template>
              </a-menu-item>
            </a-menu-item-group>
            <a-menu-item v-if="groupedActionNodeTypes.length === 0" disabled>
              No node types found
            </a-menu-item>
          </template>
          <template v-else>
            <a-menu-item
              v-for="actionType in filteredActionNodeTypes"
              :key="`action-type:${actionType.key}`"
            >
              <template #icon>
                <span
                  class="trigger-type-icon"
                  :style="{ backgroundColor: actionType.iconColor }"
                >
                  <component
                    :is="actionType.icon"
                    :style="{ color: 'white' }"
                  />
                </span>
              </template>
              {{ actionType.label }}
              <template v-if="actionType.isComingSoon">
                <a-tag color="blue" v-if="actionType.isComingSoon"
                  >Coming Soon</a-tag
                >
              </template>
            </a-menu-item>
            <a-menu-item v-if="filteredActionNodeTypes.length === 0" disabled>
              No node types found
            </a-menu-item>
          </template>
        </a-sub-menu>
        <a-menu-item
          key="make-a-copy"
          title="Make a Copy"
          v-if="nodeKind === WorkflowNodeKind.Action"
        >
          <a>Make a Copy</a>
          <template #icon>
            <CopyOutlined />
          </template>
        </a-menu-item>
        <a-menu-item key="delete-node" title="Delete Node">
          <a>Delete Node</a>
          <template #icon>
            <DeleteOutlined />
          </template>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item key="learn-more" title="Learn More">
          <a>Learn More</a>
          <template #icon>
            <InfoCircleOutlined />
          </template>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.node-action {
  color: #8c8c8c;
}

.node-action:hover {
  color: #1677ff;
}

:deep(.node-dropdown-menu) {
  min-width: 190px;
}

.trigger-type-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.node-dropdown-menu .action-submenu-static.ant-menu-item-disabled) {
  opacity: 1;
  cursor: default;
  color: inherit;
  background: transparent;
  padding-inline: 8px;
}

:deep(.node-dropdown-menu .action-submenu-static.ant-menu-item-disabled:hover) {
  background: transparent;
}

.action-search {
  width: 100%;
}

:deep(.tabs-item .ant-tabs) {
  margin-top: 4px;
}

:deep(.tabs-item .ant-tabs-nav) {
  margin-bottom: 4px;
}

:deep(.tabs-item .ant-tabs-tab) {
  padding: 4px 0;
}

.action-group-title {
  font-size: 13px;
  font-weight: 600;
  color: #8c8c8c;
  margin-top: 12px;
}
</style>
