import { UiColorsBase, type Color } from '@discord-ui-kit/seyfert'

export class Colors extends UiColorsBase {
  public override get danger(): Color {
    return [255, 149, 0]
  }

  public get acid(): Color {
    return '#8FF309'
  }
}
