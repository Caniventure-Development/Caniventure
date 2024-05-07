import type { ActionRowBuilder, ButtonBuilder } from "@discordjs/builders";
import { cooldowns } from "../handlers/commandHandler";

type DifficultyLevelName =
    | "Easy"
    | "Medium"
    | "Hard"
    | "Very Hard"
    | "Extremely Hard"
    | "Impossible";

export const wait = (timeoutMs: number): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeoutMs);
    });
};
export const minutesToSeconds = (minutes: number) => minutes * 60;
export const secondsToMilli = (seconds: number) => seconds * 1000;

export function verifyHex(hex: string) {
    return /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(hex.trim());
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              red: parseInt(result[1], 16),
              green: parseInt(result[2], 16),
              blue: parseInt(result[3], 16),
          }
        : null;
}

export function getDifficultyLevelName(
    difficultyLevel: number
): DifficultyLevelName | "Unknown" {
    switch (difficultyLevel) {
        case 1:
            return "Easy";
        case 2:
            return "Medium";
        case 3:
            return "Hard";
        case 4:
            return "Very Hard";
        case 5:
            return "Extremely Hard";
        case 6:
            return "Impossible";
        default:
            return "Unknown";
    }
}

export function disableAllButtons(row: ActionRowBuilder<ButtonBuilder>) {
    row.components.forEach((component) => {
        component.setDisabled(true);
    });
}

export function enableAllButtons(row: ActionRowBuilder<ButtonBuilder>) {
    row.components.forEach((component) => {
        component.setDisabled(false);
    });
}

export function getRandomMilliTimeFromSecondsRange(
    minSeconds: number,
    maxSeconds: number
) {
    return getRandomNumber(minSeconds, maxSeconds) * 1000;
}

export function getRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function deleteCooldown(commandName: string, userId: string) {
    const timestamps = cooldowns.get(commandName);

    if (timestamps?.has(userId)) {
        timestamps.delete(userId);
    }
}
