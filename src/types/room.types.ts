export interface CreateRoomDto {
  quizId: number;
  userId: number;
}

export interface JoinRoomDto {
  userId: number;
  roomCode: string;
}

export interface StartGameDto {
  roomCode: string;
}

export interface SubmitAnswerDto {
  roomCode: string;
  userId: number;
  questionId: number;
  answer: string;
  timeTaken: number;
}
