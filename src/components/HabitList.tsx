import styled from 'styled-components';
import { useHabits } from '../hooks/useHabits';
import { AddHabit } from './AddHabit';
import { HabitRow } from './HabitRow';

export function HabitList() {
    const { habits, logs, loading, error, addHabit, deleteHabit, toggleLog } =
        useHabits();

    if (loading) return <Info>Loading...</Info>;
    if (error) return <Info>Error: {error}</Info>;

    return (
        <div>
            <AddHabit onAdd={addHabit} />
            {habits.length === 0 ? (
                <Info>No habits yet. Add your first one above.</Info>
            ) : (
                habits.map((habit) => (
                    <HabitRow
                        key={habit.id}
                        habit={habit}
                        logs={logs}
                        onToggle={toggleLog}
                        onDelete={deleteHabit}
                    />
                ))
            )}
        </div>
    );
}

const Info = styled.p`
  color: #666;
`;