import { cooldownMiddleware } from './cooldown-handler.middleware.ts'
import { ensureBellyEmptyMiddleware } from './ensure-belly-empty.middleware.ts'
import { ensureBellyOccupiedMiddleware } from './ensure-belly-occupied.middleware.ts'
import { ensureBonesInStomachMiddleware } from './ensure-bones-in-stomach.middleware.ts'
import { ensureDocumentMiddleware } from './ensure-document.middleware.ts'
import { ensureCharacterIsNotPredatorMiddleware } from './ensure-is-not-predator.middleware.ts'
import { ensureCharacterIsNotPreyMiddleware } from './ensure-is-not-prey.middleware.ts'
import { ensureNoDocumentMiddleware } from './ensure-no-document.middleware.ts'
import { ensureNotDigestingMiddleware } from './ensure-not-digesting.middleware.ts'
import { ensureNotFullMiddleware } from './ensure-not-full.middleware.ts'
import { ensureNotInPvpMiddleware } from './ensure-not-in-pvp.middleware.ts'
import { ensureNotRegurgitatingMiddleware } from './ensure-not-regurgitating.middleware.ts'
import { ensureNotSwallowedMiddleware } from './ensure-not-swallowed.middleware.ts'
import { ensurePvpOnMiddleware } from './ensure-pvp-on.middleware.ts'
import { ensureTutorialDoneMiddleware } from './ensure-tutorial-done.middleware.ts'
import { ensureTutorialNotDoneMiddleware } from './ensure-tutorial-not-done.middleware.ts'
import { ownerOnlyMiddleware } from './owner-only.middleware.ts'

const middlewares = {
  bellyEmpty: ensureBellyEmptyMiddleware,
  bellyOccupied: ensureBellyOccupiedMiddleware,
  cooldown: cooldownMiddleware,
  characterNotPred: ensureCharacterIsNotPredatorMiddleware,
  characterNotPrey: ensureCharacterIsNotPreyMiddleware,
  hasBonesInStomach: ensureBonesInStomachMiddleware,
  hasDocument: ensureDocumentMiddleware,
  hasNoDocument: ensureNoDocumentMiddleware,
  isNotDigesting: ensureNotDigestingMiddleware,
  isNotFull: ensureNotFullMiddleware,
  isNotInPvp: ensureNotInPvpMiddleware,
  isNotRegurgitating: ensureNotRegurgitatingMiddleware,
  isNotSwallowed: ensureNotSwallowedMiddleware,
  isPvpOn: ensurePvpOnMiddleware,
  hasTutorialDone: ensureTutorialDoneMiddleware,
  hasTutorialNotDone: ensureTutorialNotDoneMiddleware,
  ownerOnly: ownerOnlyMiddleware,
}

export default middlewares
