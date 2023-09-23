export interface Exercise {
    id: string;
    name: string;
    duration: number;
    calories: number;
    date?: Date | number;
    state?: 'completed' | 'cancelled' | null;
}