export const COOLDOWN_MESSAGES: Readonly<Record<string, string>> =
  Object.freeze({
    digest:
      "Your stomach is still resting after gurgling your prey away, it'll be done {timestamp}.",
    eat: "You're out of breath! You'll have to wait for a moment before going after someone else! You'll be good {timestamp}.",
    hunt: 'Really? Hunting out of breath? Savor your moment for right now, you can go hunting again {timestamp}',
    release:
      "You had your fun with your prey, now your stomach needs a moment after having to shrink from you releasing your prey. You'll be ready to go {timestamp}",
  })
