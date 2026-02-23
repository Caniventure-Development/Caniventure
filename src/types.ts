import type {
  ChatInputCommandInteraction,
  ComponentInteraction,
  EntryPointInteraction,
  MessageCommandInteraction,
  ModalSubmitInteraction,
  UserCommandInteraction,
} from 'seyfert'
import type { UserCharacterRole } from '#entities/user/character.entity.ts'

export type InteractionType =
  | ChatInputCommandInteraction
  | UserCommandInteraction
  | MessageCommandInteraction
  | ComponentInteraction
  | ModalSubmitInteraction
  | EntryPointInteraction

export type PartialCharacter = {
  name: string
  species: string
  role: UserCharacterRole
  bio?: string
}
