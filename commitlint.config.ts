import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'

export default {
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['gulp', 'belch', 'digest', 'rumble', 'pudge', 'squirm'],
    ],
    'scope-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
    'body-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
    'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
    'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
    'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
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
  prompts: {
    settings: {},
    messages: {
      skip: ':skip',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit',
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing:",
        enum: {
          gulp: {
            description: 'Adding something new',
            title: 'Gulp',
            emoji: '🟢',
          },
          belch: {
            description: 'Removing something',
            title: 'Belch',
            emoji: '💨',
          },
          digest: {
            description: 'Refactoring existing code',
            title: 'Digest',
            emoji: '🌀',
          },
          rumble: {
            description: 'Fixing a bug',
            title: 'Rumble',
            emoji: '🔧',
          },
          pudge: {
            description: 'Completed/polished code',
            title: 'Pudge',
            emoji: '✨',
          },
          squirm: {
            description: 'Work in progress',
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
