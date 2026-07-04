export type Habit = {
    id: string;
    name: string;
    color: string;
    createdAt: string;
};

export type HabitLog = {
    id: string;
    habitId: string;
    date: string; // "YYYY-MM-DD"
};

export interface StorageProvider {
    getHabits(): Promise<Habit[]>;
    addHabit(name: string, color: string): Promise<Habit>;
    deleteHabit(id: string): Promise<void>;

    getLogs(): Promise<HabitLog[]>;
    toggleLog(habitId: string, date: string): Promise<void>;
}