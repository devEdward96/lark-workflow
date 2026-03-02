import {
  ApiOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EditOutlined,
  MailOutlined,
  MessageOutlined,
  NotificationOutlined,
  PlaySquareOutlined,
  ScheduleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue';
import type { TriggerNodeTypeOption as BaseTriggerNodeTypeOption } from '~/types/nodeTypes';

export enum TriggerNodeTypeKey {
  RecordAdded = 'record-added',
  RecordUpdated = 'record-updated',
  RecordConditionMatch = 'record-condition-match',
  RecordTriggerTime = 'record-trigger-time',
  ScheduledTime = 'scheduled-time',
  ButtonClicked = 'button-clicked',
  WebhookReceived = 'webhook-received',
  LarkMessageReceived = 'lark-message-received',
  OutlookEmailReceived = 'outlook-email-received',
  GmailEmailReceived = 'gmail-email-received',
  CalendarEvent = 'calendar-event',
}

export type TriggerNodeTypeOption = Omit<BaseTriggerNodeTypeOption, 'key'> & {
  key: TriggerNodeTypeKey;
};

export const TRIGGER_NODE_TYPES: TriggerNodeTypeOption[] = [
  {
    key: TriggerNodeTypeKey.RecordAdded,
    label: 'When a new record is added',
    subtitle: 'Trigger when a new record appears in the source table.',
    icon: NotificationOutlined,
    iconColor: '#fa8c16',
  },
  {
    key: TriggerNodeTypeKey.RecordUpdated,
    label: 'When a record updates',
    subtitle: 'Trigger when an existing record is edited.',
    icon: EditOutlined,
    iconColor: '#eb2f96',
  },
  {
    key: TriggerNodeTypeKey.RecordConditionMatch,
    label: 'When a new or updated record matches condition',
    subtitle: 'Trigger only when records satisfy configured conditions.',
    icon: ThunderboltOutlined,
    iconColor: '#2f54eb',
  },
  {
    key: TriggerNodeTypeKey.RecordTriggerTime,
    label: "At record's trigger time",
    subtitle: 'Trigger when each record reaches its configured time field.',
    icon: ClockCircleOutlined,
    iconColor: '#1d39c4',
  },
  {
    key: TriggerNodeTypeKey.ScheduledTime,
    label: 'At scheduled time',
    subtitle: 'Trigger at fixed schedule windows.',
    icon: ScheduleOutlined,
    iconColor: '#d46b08',
  },
  {
    key: TriggerNodeTypeKey.ButtonClicked,
    label: 'When a button is clicked',
    subtitle: 'Trigger from user button action.',
    icon: PlaySquareOutlined,
    iconColor: '#1677ff',
  },
  {
    key: TriggerNodeTypeKey.WebhookReceived,
    label: 'When a webhook is received',
    subtitle: 'Trigger on incoming webhook payload.',
    icon: ApiOutlined,
    iconColor: '#2f54eb',
    isComingSoon: true,
  },
  {
    key: TriggerNodeTypeKey.OutlookEmailReceived,
    label: 'When an email is received in Outlook',
    subtitle: 'Trigger for incoming Outlook mail.',
    icon: MailOutlined,
    iconColor: '#1677ff',
    isComingSoon: true,
  },
  {
    key: TriggerNodeTypeKey.GmailEmailReceived,
    label: 'When an email is received in Gmail',
    subtitle: 'Trigger for incoming Gmail mail.',
    icon: MailOutlined,
    iconColor: '#cf1322',
    isComingSoon: true,
  },
  {
    key: TriggerNodeTypeKey.CalendarEvent,
    label: 'When a calendar event starts',
    subtitle: 'Trigger when calendar event start time is reached.',
    icon: CalendarOutlined,
    iconColor: '#7c3aed',
    isComingSoon: true,
  },
];
