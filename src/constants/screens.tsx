import { Dimensions } from "react-native";

export enum ScreenName {
  WELCOME = 'WELCOME',
  EXPENSE = 'EXPENSE',
  GALLERY = 'GALLERY',
  AI_BOT = 'AI_BOT',
  IMAGE_EXPLORER = 'IMAGE_EXPLORER',
  FACE_COMPARISON = 'FACE_COMPARISON',
  TRANSLATE = 'TRANSLATE',
  IMAGE_GENERATION = 'IMAGE_GENERATION'
}

export enum screenSize {
  width = Dimensions.get('screen').width,
  height = Dimensions.get('screen').height
}