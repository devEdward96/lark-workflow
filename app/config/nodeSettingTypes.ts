
export enum TriggerOffset {
    OneDayAfter = '1_day_after',
    TwoDaysAfter = '2_days_after',
    ThreeDaysAfter = '3_days_after',
    FourDaysAfter = '4_days_after',
    FiveDaysAfter = '5_days_after',
    SixDaysAfter = '6_days_after',
    SevenDaysAfter = '7_days_after',
    OneWeekAfter = '1_week_after',
    TwoWeeksAfter = '2_weeks_after',
    ThreeWeeksAfter = '3_weeks_after',
    FourWeeksAfter = '4_weeks_after',
    FiveWeeksAfter = '5_weeks_after',
    SixWeeksAfter = '6_weeks_after',
    SevenWeeksAfter = '7_weeks_after',
    OneMonthAfter = '1_month_after',
    TwoMonthsAfter = '2_months_after',
    ThreeMonthsAfter = '3_months_after',
    FourMonthsAfter = '4_months_after',
    FiveMonthsAfter = '5_months_after',
    SixMonthsAfter = '6_months_after',
    SevenMonthsAfter = '7_months_after',
}

export const TRIGGER_OFFSET_LABELS: Record<TriggerOffset, string> = {
    [TriggerOffset.OneDayAfter]: '1 day after',
    [TriggerOffset.TwoDaysAfter]: '2 days after',
    [TriggerOffset.ThreeDaysAfter]: '3 days after',
    [TriggerOffset.FourDaysAfter]: '4 days after',
    [TriggerOffset.FiveDaysAfter]: '5 days after',
    [TriggerOffset.SixDaysAfter]: '6 days after',
    [TriggerOffset.SevenDaysAfter]: '7 days after',
    [TriggerOffset.OneWeekAfter]: '1 week after',
    [TriggerOffset.TwoWeeksAfter]: '2 weeks after',
    [TriggerOffset.ThreeWeeksAfter]: '3 weeks after',
    [TriggerOffset.FourWeeksAfter]: '4 weeks after',
    [TriggerOffset.FiveWeeksAfter]: '5 weeks after',
    [TriggerOffset.SixWeeksAfter]: '6 weeks after',
    [TriggerOffset.SevenWeeksAfter]: '7 weeks after',
    [TriggerOffset.OneMonthAfter]: '1 month after',
    [TriggerOffset.TwoMonthsAfter]: '2 months after',
    [TriggerOffset.ThreeMonthsAfter]: '3 months after',
    [TriggerOffset.FourMonthsAfter]: '4 months after',
    [TriggerOffset.FiveMonthsAfter]: '5 months after',
    [TriggerOffset.SixMonthsAfter]: '6 months after',
    [TriggerOffset.SevenMonthsAfter]: '7 months after',
};

export const TRIGGER_OFFSET_OPTIONS: { value: TriggerOffset; label: string }[] =
    (Object.values(TriggerOffset) as TriggerOffset[]).map((value) => ({
        value,
        label: TRIGGER_OFFSET_LABELS[value],
    }));


export enum ScheduleRecurrence {
    Once = 'once',
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
    Annually = 'annually',
    Weekdays = 'weekdays',
    Custom = 'custom',
}

export const RECURRENCE_OPTIONS: { value: ScheduleRecurrence; label: string }[] = [
    { value: ScheduleRecurrence.Once, label: 'Once' },
    { value: ScheduleRecurrence.Daily, label: 'Daily' },
    { value: ScheduleRecurrence.Weekly, label: 'Weekly' },
    { value: ScheduleRecurrence.Monthly, label: 'Monthly' },
    { value: ScheduleRecurrence.Annually, label: 'Annually' },
    { value: ScheduleRecurrence.Weekdays, label: 'From Monday to Friday' },
    { value: ScheduleRecurrence.Custom, label: 'Custom' },
];
