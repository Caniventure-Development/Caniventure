import { type Color, UiColorsBase } from '@discord-ui-kit/seyfert'

export class Colors extends UiColorsBase {
  public override get danger(): Color {
    return [255, 149, 0]
  }
}
