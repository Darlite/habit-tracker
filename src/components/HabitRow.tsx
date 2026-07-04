import { useMemo } from 'react';
import styled from 'styled-components';
import type { Habit, HabitLog } from '../storage/types';
import { toISODate } from '../lib/dates';
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
            <Heatmap
                color={habit.color}
                loggedDates={loggedDates}
                onToggle={(date) => onToggle(habit.id, date)}
            />
        </Card>
    );
}

// Count consecutive days ending today (or yesterday if today not done yet)
function calcStreak(loggedDates: Set<string>): number {
    let count = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    // If today is not logged, start counting from yesterday
    if (!loggedDates.has(toISODate(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (loggedDates.has(toISODate(cursor))) {
        count++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return count;
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