export function combineDateTime(date: string, time: string) {
  const dateParts = date.split("-");
  const timeParts = time.split(":");
  const combinedDate = new Date(
    parseInt(dateParts[0]), // Year
    parseInt(dateParts[1]) - 1, // Month (months are zero-based in Date)
    parseInt(dateParts[2]), // Day
    parseInt(timeParts[0]), // Hour
    parseInt(timeParts[1]), // Minute
    parseInt(timeParts[2]) // Second
  );

  return combinedDate;
}
