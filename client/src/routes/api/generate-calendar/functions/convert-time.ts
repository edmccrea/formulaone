export function convertTimeWithDate(utcTime: string, date: Date): string {
  const timeParts = utcTime.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2].replace("Z", ""));

  const isDST = isDaylightSavingTime(date);

  const offset = isDST ? 2 : 1;
  const newHours = (hours + offset) % 24;

  const formattedTime = `${newHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}

function isDaylightSavingTime(date: Date): boolean {
  const year = date.getFullYear();
  const dstStart = new Date(year, 2, 31 - (((5 * year) / 4 + 4) % 7), 2, 0); // Last Sunday in March, 02:00 CET
  const dstEnd = new Date(year, 9, 31 - (((5 * year) / 4 + 1) % 7), 3, 0); // Last Sunday in October, 03:00 CEST

  return date >= dstStart && date < dstEnd;
}
