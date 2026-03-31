import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'

export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['gulp', 'belch', 'digest', 'churn', 'pudge', 'squirm'],
    ],
    'scope-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'body-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 400],
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
    'header-min-length': [RuleConfigSeverity.Warning, 'always', 10],
    'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
    'header-trim': [RuleConfigSeverity.Error, 'always'],
    'subject-case': [
      RuleConfigSeverity.Error,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [RuleConfigSeverity.Error, 'never'],
    'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
    'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'type-empty': [RuleConfigSeverity.Error, 'never'],
  },
  prompt: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'max of %d chars',
      min: '%d chars required at least',
      emptyWarning: 'I need something to melt, give me something!',
      upperLimitWarning: "Too much food, that's gonna overstuff me!",
      lowerLimitWarning: 'Barely even a snack, give me more!',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          gulp: {
            description: 'Adding more prey to the belly',
            title: 'Gulp',
            emoji: '🟢',
          },
          belch: {
            description: 'Expelled some garbage',
            title: 'Belch',
            emoji: '💨',
          },
          digest: {
            description: 'Softening up the code, easier to melt',
            title: 'Digest',
            emoji: '🌀',
          },
          churn: {
            description: 'Getting through them, melted another soft spot',
            title: 'Churn',
            emoji: '🔧',
          },
          pudge: {
            description: 'A new layer of stuff for the bot',
            title: 'Pudge',
            emoji: '✨',
          },
          squirm: {
            description: 'Still alive in there, still working on it',
            title: 'Squirm',
            emoji: '🔄',
          },
        },
      },
      scope: {
        description:
          'What is the scope of this change (e.g. component or file name)',
      },
      subject: {
        description:
          'Write a short, imperative tense description of the change',
      },
      body: {
        description: 'Provide a longer description of the change',
      },
      isBreaking: {
        description: 'Are there any breaking changes?',
      },
      breakingBody: {
        description:
          'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself',
      },
      breaking: {
        description: 'Describe the breaking changes',
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?',
      },
      issuesBody: {
        description:
          'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself',
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)',
      },
    },
  },
} satisfies UserConfig
