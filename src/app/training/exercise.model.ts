export interface PreExercise {
  name: string;
  duration: number;
  calories: number;
  date?: Date;
  state?: 'completed' | 'cancelled' | null;
}

export interface Exercise  extends PreExercise {
  id: string;
}
