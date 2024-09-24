export default function timeString(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
