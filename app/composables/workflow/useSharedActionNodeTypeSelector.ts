import { computed, ref } from 'vue';
import { createSharedComposable } from '@vueuse/core';
import {
  ACTION_NODE_CATEGORY_TABS,
  ACTION_NODE_TYPES,
  type ActionNodeTypeOption,
} from '~/config/actionNodeTypes';
import type { ActionNodeCategory } from '~/types/nodeTypes';

type ActionNodeTypeGroup = {
  category: Exclude<ActionNodeCategory, 'all'>;
  label: string;
  items: ActionNodeTypeOption[];
};

function useActionNodeTypeSelector() {
  const actionSearch = ref('');
  const activeActionCategory = ref<ActionNodeCategory>('all');

  const filteredActionNodeTypes = computed(() => {
    const keyword = actionSearch.value.trim().toLowerCase();
    return ACTION_NODE_TYPES.filter((item) => {
      const matchesCategory = activeActionCategory.value === 'all'
        ? true
        : item.category === activeActionCategory.value;
      const matchesKeyword = !keyword || item.label.toLowerCase().includes(keyword);
      return matchesCategory && matchesKeyword;
    });
  });

  const groupedActionNodeTypes = computed(() => {
    const keyword = actionSearch.value.trim().toLowerCase();
    const tabsWithoutAll = ACTION_NODE_CATEGORY_TABS.filter(tab => tab.key !== 'all');

    return tabsWithoutAll
      .map((tab) => {
        const items = ACTION_NODE_TYPES.filter((item) => {
          const matchesCategory = item.category === tab.key;
          const matchesKeyword = !keyword || item.label.toLowerCase().includes(keyword);
          return matchesCategory && matchesKeyword;
        });

        return {
          category: tab.key,
          label: tab.label,
          items,
        };
      })
      .filter(group => group.items.length > 0) as ActionNodeTypeGroup[];
  });

  return {
    actionSearch,
    activeActionCategory,
    filteredActionNodeTypes,
    groupedActionNodeTypes,
    actionNodeCategoryTabs: ACTION_NODE_CATEGORY_TABS,
  };
}

export const useSharedActionNodeTypeSelector = createSharedComposable(useActionNodeTypeSelector);
