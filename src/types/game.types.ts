import { QuestionResponseDto } from "./question.types";

export interface GameRoomDto {
  roomCode: string;
  quizId: number;
  hostUserId: number;
  questions: QuestionResponseDto[];
  participants: RoomParticipantDto[];
  status: string;
  createdAt: Date;
  startedAt: Date;
}

export interface GameStateDto {
  roomCode: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  startTime: Date;
  status: string;
}

export interface RoomParticipantDto {
  userId: number;
  userName: string;
  joinedAt: Date;
}

export interface UserAnswerEntryDto {
  userId: number;
  roomId: number; 
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  score: number;
  timeTaken: number;
}

export interface UserAnswersDto {
  roomId: number;
  userAnswers: UserAnswerEntryDto[];
}

export interface LeaderboardSnapshotEntryDto {
  roomId: number;
  quizId: number;
  userId: number;
  score: number;
}

export interface LeaderboardSnapshotDto {
  roomId: number;
  entries: LeaderboardSnapshotEntryDto[];
}


