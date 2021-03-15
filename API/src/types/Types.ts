import { CreateCharacterRequest } from "./Models";

export interface Character extends CreateCharacterRequest {
  id: string,
  hp: number,
  maxHp: number,
  tempHp: number
}

export interface CharacterHp {
  id: string,
  hp: number,
  maxHp: number,
  tempHp: number
}

export interface ApiResponse {
  message: string
}