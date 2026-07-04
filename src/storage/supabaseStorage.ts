import { supabase } from '../lib/supabase';
import type { Habit, HabitLog, StorageProvider } from './types';

// DB row shapes (snake_case) mapped to our camelCase types
type HabitRow = {
    id: string;
    name: string;
    color: string;
    created_at: string;
};

type LogRow = {
    id: string;
    habit_id: string;
    date: string;
};

const mapHabit = (row: HabitRow): Habit => ({
    id: row.id,
    name: row.name,
    color: row.color,
    createdAt: row.created_at,
});

const mapLog = (row: LogRow): HabitLog => ({
    id: row.id,
    habitId: row.habit_id,
    date: row.date,
});

async function getUserId(): Promise<string> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw new Error('Not authenticated');
    return data.user.id;
}

export const supabaseStorage: StorageProvider = {
    async getHabits() {
        const { data, error } = await supabase
            .from('habits')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) throw error;
        return (data as HabitRow[]).map(mapHabit);
    },

    async addHabit(name, color) {
        const userId = await getUserId();
        const { data, error } = await supabase
            .from('habits')
            .insert({ name, color, user_id: userId })
            .select()
            .single();

        if (error) throw error;
        return mapHabit(data as HabitRow);
    },

    async deleteHabit(id) {
        const { error } = await supabase.from('habits').delete().eq('id', id);
        if (error) throw error;
    },

    async getLogs() {
        const { data, error } = await supabase.from('habit_logs').select('*');
        if (error) throw error;
        return (data as LogRow[]).map(mapLog);
    },

    async toggleLog(habitId, date) {
        const userId = await getUserId();

        // Check if a log already exists for this habit/date
        const { data: existing, error: selectError } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('habit_id', habitId)
            .eq('date', date)
            .maybeSingle();

        if (selectError) throw selectError;

        if (existing) {
            const { error } = await supabase
                .from('habit_logs')
                .delete()
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('habit_logs')
                .insert({ habit_id: habitId, date, user_id: userId });
            if (error) throw error;
        }
    },
};