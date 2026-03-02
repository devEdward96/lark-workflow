import { FolderOutlined, BoxPlotFilled } from '@ant-design/icons-vue';

const sampleVariablesTree = [
  {
    key: 'base',
    title: 'Base',
    selectable: false,
    itemIcon: FolderOutlined,
    children: [
      {
        key: 'base.id',
        title: 'Base ID',
        isLeaf: true,
        itemIcon: BoxPlotFilled,
      },
      {
        key: 'base.table',
        title: 'Table',
        selectable: false,
        children: [
          {
            key: 'table.client_management',
            title: 'Client management',
            selectable: false,
            children: [
              {
                key: 'table.client_management.id',
                title: 'Table ID',
                isLeaf: true,
              },
              {
                key: 'table.client_management.client_info_view',
                title: 'Client info',
                isLeaf: true,
              },
              {
                key: 'table.client_management.new_client_form_view',
                title: 'New client form',
                isLeaf: true,
              },
              {
                key: 'table.client_management.new_this_week_view',
                title: 'New this week',
                isLeaf: true,
              },
              {
                key: 'table.client_management.client_by_region_view',
                title: 'Client by region',
                isLeaf: true,
              },
            ],
          },
          {
            key: 'table.opportunity_management',
            title: 'Opportunity management',
            selectable: false,
            children: [
              {
                key: 'table.opportunity_management.summary_view',
                title: 'Summary of opportunities',
                isLeaf: true,
              },
              {
                key: 'table.opportunity_management.stage_kanban_view',
                title: 'Stage kanban',
                isLeaf: true,
              },
              {
                key: 'table.opportunity_management.order_won_kanban_view',
                title: 'Order won kanban',
                isLeaf: true,
              },
              {
                key: 'table.opportunity_management.expected_close_view',
                title: 'Expected close …',
                isLeaf: true,
              },
              {
                key: 'table.opportunity_management.new_opportunities_view',
                title: 'New opportunities',
                isLeaf: true,
              },
            ],
          },
          {
            key: 'table.client_visits',
            title: 'Client visits',
            isLeaf: true,
          },
        ],
      },
      {
        key: 'base.view',
        title: 'View',
        selectable: false,
        children: [
          {
            key: 'view.client_management',
            title: 'Client management views',
            selectable: false,
            children: [
              {
                key: 'view.client_management.client_info',
                title: 'Client info',
                isLeaf: true,
              },
              {
                key: 'view.client_management.new_client_form',
                title: 'New client form',
                isLeaf: true,
              },
            ],
          },
          {
            key: 'view.opportunity_management',
            title: 'Opportunity management views',
            selectable: false,
            children: [
              {
                key: 'view.opportunity_management.stage_kanban',
                title: 'Stage kanban',
                isLeaf: true,
              },
              {
                key: 'view.opportunity_management.order_won_kanban',
                title: 'Order won kanban',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 'record',
    title: 'The first record found',
    selectable: false,
    children: [
      {
        key: 'record.client_health_score',
        title: 'Client health score',
        isLeaf: true,
      },
      {
        key: 'record.industry',
        title: 'Industry',
        isLeaf: true,
      },
      {
        key: 'record.id',
        title: 'Record ID',
        isLeaf: true,
      },
      {
        key: 'record.link',
        title: 'Record link',
        isLeaf: true,
      },
      {
        key: 'record.total_records_found',
        title: 'Total records found',
        isLeaf: true,
      },
    ],
  },
  {
    key: 'client',
    title: 'Client',
    selectable: false,
    children: [
      {
        key: 'client.field_id',
        title: 'Field ID',
        isLeaf: true,
      },
      {
        key: 'client.field_name',
        title: 'Field name',
        isLeaf: true,
      },
      {
        key: 'client.client_health_score',
        title: 'Client health score',
        isLeaf: true,
      },
      {
        key: 'client.industry',
        title: 'Industry',
        isLeaf: true,
      },
      {
        key: 'client.arr',
        title: "Client's ARR",
        isLeaf: true,
      },
      {
        key: 'client.stage',
        title: 'Stage',
        isLeaf: true,
      },
      {
        key: 'client.position_of_contact',
        title: 'Position of contact',
        isLeaf: true,
      },
      {
        key: 'client.phone_number',
        title: 'Phone number',
        isLeaf: true,
      },
      {
        key: 'client.sales_manager',
        title: 'Sales manager',
        isLeaf: true,
      },
      {
        key: 'client.record_id',
        title: 'Record ID',
        isLeaf: true,
      },
      {
        key: 'client.record_link',
        title: 'Record link',
        isLeaf: true,
      },
      {
        key: 'client.created_on',
        title: 'Created on',
        isLeaf: true,
      },
      {
        key: 'client.latest_follow_up_date',
        title: 'Latest follow-up date',
        isLeaf: true,
      },
      {
        key: 'client.trigger_time',
        title: 'Trigger time',
        isLeaf: true,
      },
    ],
  },
];

export default sampleVariablesTree;

