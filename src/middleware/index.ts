import { ensureBellyEmptyMiddleware } from './ensure-belly-empty.middleware.ts'
import { ensureBellyOccupiedMiddleware } from './ensure-belly-occupied.middleware.ts'
import { ensureDocumentMiddleware } from './ensure-document.middleware.ts'
import { ensureNoDocumentMiddleware } from './ensure-no-document.middleware.ts'
import { ensureNotFullMiddleware } from './ensure-not-full.middleware.ts'
import { ensureTutorialDoneMiddleware } from './ensure-tutorial-done.middleware.ts'
import { ensureTutorialNotDoneMiddleware } from './ensure-tutorial-not-done.middleware.ts'
import { ownerOnlyMiddleware } from './owner-only.middleware.ts'

const middlewares = {
  ensureBellyEmpty: ensureBellyEmptyMiddleware,
  ensureBellyOccupied: ensureBellyOccupiedMiddleware,
  ensureDocument: ensureDocumentMiddleware,
  ensureNoDocument: ensureNoDocumentMiddleware,
  ensureNotFull: ensureNotFullMiddleware,
  ensureTutorialDone: ensureTutorialDoneMiddleware,
  ensureTutorialNotDone: ensureTutorialNotDoneMiddleware,
  ownerOnly: ownerOnlyMiddleware,
}

export default middlewares
