export enum ButtonConditionOperator {
    Is = 'is',
    IsNot = 'is_not',
    Contains = 'contains',
    NotContains = 'not_contains',
    StartsWith = 'starts_with',
    EndsWith = 'ends_with',
    IsEmpty = 'is_empty',
    IsNotEmpty = 'is_not_empty',
}

export const BUTTON_CONDITION_OPERATOR_OPTIONS: { value: ButtonConditionOperator; label: string }[] = [
    { value: ButtonConditionOperator.Is, label: 'is' },
    { value: ButtonConditionOperator.IsNot, label: 'is not' },
    { value: ButtonConditionOperator.Contains, label: 'contains' },
    { value: ButtonConditionOperator.NotContains, label: 'does not contain' },
    { value: ButtonConditionOperator.StartsWith, label: 'starts with' },
    { value: ButtonConditionOperator.EndsWith, label: 'ends with' },
    { value: ButtonConditionOperator.IsEmpty, label: 'is empty' },
    { value: ButtonConditionOperator.IsNotEmpty, label: 'is not empty' },
];