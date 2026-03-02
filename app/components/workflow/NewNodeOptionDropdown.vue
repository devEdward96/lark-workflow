<script setup lang="ts">
import { SearchOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { WorkflowNodeKind } from '~/types/workflow';
import { useSharedActionNodeTypeSelector } from '~/composables/workflow/useSharedActionNodeTypeSelector';
import { CONDITION_NODE_TYPES } from '~/config/conditionNodeTypes';

defineProps<{
  nodeKind: WorkflowNodeKind;
  placement?: 'bottomCenter' | 'bottomRight' | 'bottomLeft';
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
  <a-dropdown :placement="placement ?? 'bottomCenter'">
    <slot name="trigger">
      <a-button type="text" class="node-action nodrag nopan">
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
    </slot>
    <template #overlay>
      <a-menu
        class="node-dropdown-menu nodrag nopan"
        :trigger-sub-menu-action="'hover'"
        @click="onMenuClick"
      >
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

        <div style="max-height: 300px; overflow-y: auto">
          <template v-if="activeActionCategory === 'all'">
            <a-menu-item-group
              key="condition-node-group"
              class="action-group"
              v-if="nodeKind === WorkflowNodeKind.NewNode"
            >
              <template #title>
                <span class="action-group-title">Condition</span>
              </template>
              <a-menu-item
                v-for="conditionType in CONDITION_NODE_TYPES"
                :key="`condition-type:${conditionType.key}`"
              >
                <template #icon>
                  <span
                    class="condition-type-icon"
                    :style="{ backgroundColor: conditionType.iconColor }"
                  >
                    <component
                      :is="conditionType.icon"
                      :style="{ color: 'white' }"
                    />
                  </span>
                </template>
                {{ conditionType.label }}
                <template v-if="conditionType.isComingSoon">
                  <a-tag color="default">Coming Soon</a-tag>
                </template>
              </a-menu-item>
            </a-menu-item-group>
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
                    class="action-type-icon"
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
                  <a-tag color="default">Coming Soon</a-tag>
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
                  class="action-type-icon"
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
                <a-tag color="default">Coming Soon</a-tag>
              </template>
            </a-menu-item>
            <a-menu-item v-if="filteredActionNodeTypes.length === 0" disabled>
              No node types found
            </a-menu-item>
          </template>
        </div>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.node-action {
  color: #8c8c8c;
  width: 50px;
  height: 50px;
  min-width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.node-action:hover {
  color: #1677ff;
}

:deep(.node-dropdown-menu) {
  min-width: 190px;
}

.action-type-icon {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.condition-type-icon {
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
