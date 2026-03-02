<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';
import { TriggerNodeTypeKey } from '~/config/triggerNodeTypes';
import ButtonClickedTriggerNodeSettings from '~/components/workflow/settings/triggers/ButtonClickedTriggerNodeSettings.vue';
import RecordAddedTriggerNodeSettings from '~/components/workflow/settings/triggers/RecordAddedTriggerNodeSettings.vue';
import RecordUpdatedTriggerNodeSettings from '~/components/workflow/settings/triggers/RecordUpdatedTriggerNodeSettings.vue';
import RecordConditionMatchTriggerNodeSettings from '~/components/workflow/settings/triggers/RecordConditionMatchTriggerNodeSettings.vue';
import RecordTriggerTimeTriggerNodeSettings from '~/components/workflow/settings/triggers/RecordTriggerTimeTriggerNodeSettings.vue';
import ScheduledTimeTriggerNodeSettings from '~/components/workflow/settings/triggers/ScheduledTimeTriggerNodeSettings.vue';

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();

const currentTriggerNodeSettingsComponent = computed(() => {
  if (!props.node?.data) {
    return null;
  }
  switch (props.node?.data.triggerType) {
    case TriggerNodeTypeKey.ButtonClicked:
      return ButtonClickedTriggerNodeSettings;
    case TriggerNodeTypeKey.RecordAdded:
      return RecordAddedTriggerNodeSettings;
    case TriggerNodeTypeKey.RecordUpdated:
      return RecordUpdatedTriggerNodeSettings;
    case TriggerNodeTypeKey.RecordConditionMatch:
      return RecordConditionMatchTriggerNodeSettings;
    case TriggerNodeTypeKey.RecordTriggerTime:
      return RecordTriggerTimeTriggerNodeSettings;
    case TriggerNodeTypeKey.ScheduledTime:
      return ScheduledTimeTriggerNodeSettings;
    default:
      return null;
  }
});
</script>

<template>
  <template v-if="props.node && props.node.data">
    <component :is="currentTriggerNodeSettingsComponent" :node="props.node" />
  </template>
</template>
