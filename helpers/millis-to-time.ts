export function millisToTime(millis: number) {
  const total = millis;
  const seconds = Math.floor((millis / 1000) % 60);
  const minutes = Math.floor((millis / 1000 / 60) % 60);
  const hours = Math.floor((millis / (1000 * 60 * 60)) % 24);
  const days = Math.floor(millis / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
}
