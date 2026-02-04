import type {
  ChatInputCommandInteraction,
  ComponentInteraction,
  EntryPointInteraction,
  MessageCommandInteraction,
  ModalSubmitInteraction,
  UserCommandInteraction,
} from 'seyfert'

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
  bio?: string
}
