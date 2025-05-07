export interface GetQuizByUserIdDto {
  userId: number;
}

export interface CreateQuizDto {
  title: string;
  description: string;
  ownerId: number;
}

export interface QuizResponseDto {
  quizId: number;
  title: string;
  description: string;
  
}
