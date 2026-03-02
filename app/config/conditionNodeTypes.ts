import {
  BranchesOutlined,
  QuestionCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';
import type { ConditionNodeTypeOption as BaseConditionNodeTypeOption } from '~/types/nodeTypes';

export enum ConditionNodeTypeKey {
  IfElse = 'if-else',
  Loop = 'loop',
  MultiBranch = 'multi-branch',
}

export type ConditionNodeTypeOption = Omit<BaseConditionNodeTypeOption, 'key'> & {
  key: ConditionNodeTypeKey;
};

export const CONDITION_NODE_TYPES: ConditionNodeTypeOption[] = [
  {
    key: ConditionNodeTypeKey.IfElse,
    label: 'If/Else',
    subtitle: 'Evaluate a branching rule',
    icon: QuestionCircleOutlined,
    iconColor: '#000000',
  },
  {
    key: ConditionNodeTypeKey.Loop,
    label: 'Loop',
    subtitle: 'Loop through a list of items',
    icon: ThunderboltOutlined,
    iconColor: '#000000',
  },
  {
    key: ConditionNodeTypeKey.MultiBranch,
    label: 'Multi-Branch',
    subtitle: 'Evaluate multiple branching rules',
    icon: BranchesOutlined,
    iconColor: '#000000',
  },
];
