export interface ExercisePlan {
  exercise: string;
  reps: number;
  sets: number;
  weight?: number;
  rpe?: number;
}

export interface WarmUpPlan {
  description: string;
}

export interface WorkoutPlan {
  title: string;
  complete: boolean;
  warm_ups: WarmUpPlan[];
  exercises: ExercisePlan[];
}

export interface WeekPlan {
  summary: string;
  complete: boolean;
  workouts: WorkoutPlan[];
}
