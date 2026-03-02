import {
  BgColorsOutlined,
  BranchesOutlined,
  CodeOutlined,
  CustomerServiceOutlined,
  FileSearchOutlined,
  MailOutlined,
  MessageOutlined,
  RobotOutlined,
  SendOutlined,
  ThunderboltOutlined,
  ToolOutlined,
} from '@ant-design/icons-vue';
import type {
  ActionNodeCategory,
  ActionNodeTypeOption as BaseActionNodeTypeOption,
} from '~/types/nodeTypes';

export type { ActionNodeCategory } from '~/types/nodeTypes';

export enum ActionNodeTypeKey {
  SendLarkMessage = 'send-lark-message',
  AddRecord = 'add-record',
  UpdateRecord = 'update-record',
  FindRecords = 'find-records',
  AiGeneratedTextGpt = 'ai-generated-text-gpt',
  AiGeneratedText = 'ai-generated-text',
  Javascript = 'javascript',
  HttpRequest = 'http-request',
  SendEmailOutlook = 'send-email-outlook',
  SendEmailGmail = 'send-email-gmail',
  LarkNotification = 'lark-notification',
  NodeShortcutCenter = 'node-shortcut-center',
}

export type ActionNodeTypeOption = Omit<BaseActionNodeTypeOption, 'key'> & {
  key: ActionNodeTypeKey;
};

export const ACTION_NODE_CATEGORY_TABS: Array<{ key: ActionNodeCategory; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'frequent', label: 'Frequent' },
  { key: 'base', label: 'Base' },
  { key: 'ai', label: 'AI' },
  { key: 'node-shortcuts', label: 'Node Shortcuts' },
];

export const ACTION_NODE_TYPES: ActionNodeTypeOption[] = [
  {
    key: ActionNodeTypeKey.SendLarkMessage,
    label: 'Send a Lark message',
    subtitle: 'Post a message to a selected Lark chat.',
    category: 'base',
    icon: SendOutlined,
    iconColor: '#1677ff',
  },
  {
    key: ActionNodeTypeKey.AddRecord,
    label: 'Add record',
    subtitle: 'Create a new row in target data source.',
    category: 'frequent',
    icon: ThunderboltOutlined,
    iconColor: '#fa8c16',
  },
  {
    key: ActionNodeTypeKey.UpdateRecord,
    label: 'Update record',
    subtitle: 'Update fields on an existing row.',
    category: 'frequent',
    icon: ToolOutlined,
    iconColor: '#eb2f96',
  },
  {
    key: ActionNodeTypeKey.FindRecords,
    label: 'Find records',
    subtitle: 'Query records with filters.',
    category: 'frequent',
    icon: FileSearchOutlined,
    iconColor: '#1677ff',
  },
  {
    key: ActionNodeTypeKey.AiGeneratedTextGpt,
    label: 'AI-generated text (GPT model)',
    subtitle: 'Generate text with a GPT-compatible model.',
    category: 'ai',
    icon: RobotOutlined,
    iconColor: '#2f54eb',
  },
  {
    key: ActionNodeTypeKey.AiGeneratedText,
    label: 'AI-generated text',
    subtitle: 'Generate text with the default LLM.',
    category: 'ai',
    icon: BgColorsOutlined,
    iconColor: '#1d39c4',
  },
  {
    key: ActionNodeTypeKey.Javascript,
    label: 'JavaScript',
    subtitle: 'Run a JavaScript transform step.',
    category: 'base',
    icon: CodeOutlined,
    iconColor: '#434343',
  },
  {
    key: ActionNodeTypeKey.HttpRequest,
    label: 'HTTP request',
    subtitle: 'Call an external HTTP endpoint.',
    category: 'node-shortcuts',
    icon: BranchesOutlined,
    iconColor: '#2f54eb',
  },
  {
    key: ActionNodeTypeKey.SendEmailOutlook,
    label: 'Send email with Outlook',
    subtitle: 'Send an email via Outlook connector.',
    category: 'frequent',
    icon: MailOutlined,
    iconColor: '#1677ff',
  },
  {
    key: ActionNodeTypeKey.SendEmailGmail,
    label: 'Send email with Gmail',
    subtitle: 'Send an email via Gmail connector.',
    category: 'frequent',
    icon: MailOutlined,
    iconColor: '#cf1322',
  },
  {
    key: ActionNodeTypeKey.LarkNotification,
    label: 'Send Lark notification',
    subtitle: 'Push a Lark in-app notification.',
    category: 'base',
    icon: MessageOutlined,
    iconColor: '#13c2c2',
  },
  {
    key: ActionNodeTypeKey.NodeShortcutCenter,
    label: 'Node Shortcut Center',
    subtitle: 'Open shortcut templates for common actions.',
    category: 'node-shortcuts',
    icon: CustomerServiceOutlined,
    iconColor: '#7c3aed',
  },
];
