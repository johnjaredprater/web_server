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

export interface UserProfile {
  age: number;
  gender: string;
  number_of_days: number;
  workout_duration: number;
  fitness_level: string;
  goal: string;
  injury_description?: string;
}

export interface UserProfileFormData {
  age?: string;
  gender?: string;
  number_of_days?: string;
  workout_duration?: string;
  fitness_level?: string;
  goal?: string;
  injury_description?: string;
}
