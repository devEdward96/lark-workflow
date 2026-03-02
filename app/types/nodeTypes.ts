import type { Component } from 'vue';

export type ActionNodeCategory = 'all' | 'frequent' | 'base' | 'ai' | 'node-shortcuts';

export interface TriggerNodeTypeOption {
  key: string;
  label: string;
  subtitle: string;
  icon: Component;
  iconColor: string;
  iconBackground?: string;
  isComingSoon?: boolean;
}

export interface ActionNodeTypeOption {
  key: string;
  label: string;
  subtitle: string;
  category: ActionNodeCategory;
  icon: Component;
  iconColor: string;
  iconBackground?: string;
  isComingSoon?: boolean;
}

export interface ConditionNodeTypeOption {
  key: string;
  label: string;
  subtitle: string;
  icon: Component;
  iconColor: string;
  iconBackground?: string;
  isComingSoon?: boolean;
}
