export type TutorialSectionContent = {
  title: string
  description: string
}

export abstract class TutorialSection {
  public abstract getContent(): TutorialSectionContent
}
