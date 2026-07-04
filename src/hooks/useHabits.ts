import { useCallback, useEffect, useState } from 'react';
import { supabaseStorage } from '../storage/supabaseStorage';
import type { Habit, HabitLog } from '../storage/types';

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [h, l] = await Promise.all([
                supabaseStorage.getHabits(),
                supabaseStorage.getLogs(),
            ]);
            setHabits(h);
            setLogs(l);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const addHabit = useCallback(async (name: string, color: string) => {
        const habit = await supabaseStorage.addHabit(name, color);
        setHabits((prev) => [...prev, habit]);
    }, []);

    const deleteHabit = useCallback(async (id: string) => {
        await supabaseStorage.deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
        setLogs((prev) => prev.filter((l) => l.habitId !== id));
    }, []);

    const toggleLog = useCallback(async (habitId: string, date: string) => {
        // Optimistic update
        const existing = logs.find(
            (l) => l.habitId === habitId && l.date === date
        );

        if (existing) {
            setLogs((prev) => prev.filter((l) => l.id !== existing.id));
        } else {
            // temporary log with a placeholder id
            const optimistic: HabitLog = {
                id: `temp-${habitId}-${date}`,
                habitId,
                date,
            };
            setLogs((prev) => [...prev, optimistic]);
        }

        try {
            await supabaseStorage.toggleLog(habitId, date);
            // Re-sync logs to get real ids from DB
            const fresh = await supabaseStorage.getLogs();
            setLogs(fresh);
        } catch (e) {
            // Revert on error by reloading
            setError(e instanceof Error ? e.message : 'Failed to toggle');
            await load();
        }
    }, [logs, load]);

    return {
        habits,
        logs,
        loading,
        error,
        addHabit,
        deleteHabit,
        toggleLog,
    };
}