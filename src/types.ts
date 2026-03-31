import type {
  ChatInputCommandInteraction,
  ComponentInteraction,
  EntryPointInteraction,
  InteractionGuildMember,
  MessageCommandInteraction,
  ModalSubmitInteraction,
  User,
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

export type AnySeyfertUser = InteractionGuildMember | User

export enum ComponentType {
  Button = 'button',
  SelectMenu = 'select',
}
