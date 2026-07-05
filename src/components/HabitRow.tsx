import { useMemo } from 'react';
import styled from 'styled-components';
import type { Habit, HabitLog } from '../storage/types';
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

    return (
        <Card>
            <TopRow>
                <Name>{habit.name}</Name>
                <Right>
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