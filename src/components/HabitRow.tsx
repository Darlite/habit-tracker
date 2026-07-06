import { useMemo } from 'react';
import styled from 'styled-components';
import type { Habit, HabitLog } from '../storage/types';
import { getToday, getYesterday } from '../lib/dates';
import { Heatmap } from './Heatmap';

type Props = {
    habit: Habit;
    logs: HabitLog[];
    onToggle: (habitId: string, date: string) => void;
    onDelete: (id: string) => void;
};

export function HabitRow({ habit, logs, onToggle, onDelete }: Props) {
    const loggedDates = useMemo(
        () => new Set(logs.filter((l) => l.habitId === habit.id).map((l) => l.date)),
        [logs, habit.id]
    );

    const today = getToday();
    const yesterday = getYesterday();
    const todayDone = loggedDates.has(today);
    const yesterdayDone = loggedDates.has(yesterday);

    const streak = useMemo(() => calcStreak(loggedDates), [loggedDates]);

    return (
        <Card>
            <TopRow>
                <Name>{habit.name}</Name>
                <Right>
                    {streak > 0 && <Streak>🔥 {streak}</Streak>}
                    <DeleteBtn
                        onClick={() => {
                            if (confirm(`Delete "${habit.name}"?`)) onDelete(habit.id);
                        }}
                    >
                        ✕
                    </DeleteBtn>
                </Right>
            </TopRow>

            <Heatmap color={habit.color} loggedDates={loggedDates} />

            <Actions>
                <ToggleBtn
                    $active={yesterdayDone}
                    $color={habit.color}
                    onClick={() => onToggle(habit.id, yesterday)}
                >
                    {yesterdayDone ? '✓ ' : ''}Yesterday
                </ToggleBtn>
                <ToggleBtn
                    $active={todayDone}
                    $color={habit.color}
                    onClick={() => onToggle(habit.id, today)}
                >
                    {todayDone ? '✓ ' : ''}Today
                </ToggleBtn>
            </Actions>
        </Card>
    );
}

function calcStreak(loggedDates: Set<string>): number {
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    if (!loggedDates.has(toISODateLocal(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (loggedDates.has(toISODateLocal(cursor))) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return count;
}

// local helper to avoid importing toISODate just for this
function toISODateLocal(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Name = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const Right = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const Streak = styled.span`
    font-size: 14px;
    color: #666;
`;

const DeleteBtn = styled.button`
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    font-size: 16px;
    padding: 0;

    &:hover {
        color: #d33;
    }
`;

const Actions = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 12px;
`;

const ToggleBtn = styled.button<{ $active: boolean; $color: string }>`
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    border: 1px solid ${({ $active, $color }) => ($active ? $color : '#d0d0d0')};
    background: ${({ $active, $color }) => ($active ? $color : '#fff')};
    color: ${({ $active }) => ($active ? '#fff' : '#333')};

    &:hover {
        border-color: ${({ $color }) => $color};
    }
`;