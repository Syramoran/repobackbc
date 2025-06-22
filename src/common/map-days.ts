import { Days } from "./enum-days";

export function mapDayToEnum(day: number): Days {
  return day === 0 ? Days.DOMINGO : day as Days;
}
