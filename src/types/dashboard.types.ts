export interface UserStatsDto {
  totalQuizzesCreated: number;
  totalQuizzesParticipated: number;
  accuracyRate: number;
}

export interface DetailUserAnswersDto {
  content: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  selectedOption: string;
}

export interface DetailQuizStatsDto {
  roomId: number;
  startedAt: Date;
  title: string;
  description: string;
  userAnswers: DetailUserAnswersDto[];
}

export interface QuizStatsDto {
  quiz: DetailQuizStatsDto[];
}


