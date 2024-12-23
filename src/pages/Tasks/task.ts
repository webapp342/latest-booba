export interface Task {
  title: string;
  description: string;
  completed: boolean;
  disabled: boolean;
  link: string;
}

export interface ButtonState {
  loading: boolean;
  claimLoading: boolean;
  startTime: number | null;
}

export interface ButtonStates {
  [key: number]: ButtonState;
}