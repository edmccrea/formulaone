export function convertTime(utcTime: string): string {
  const timeParts = utcTime.split(":");
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);
  const seconds = parseInt(timeParts[2].replace("Z", ""));

  const newHours = (hours + 1) % 24;

  const formattedTime = `${newHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
}
