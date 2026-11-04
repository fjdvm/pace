const tones = ["bg-pace-blue", "bg-pace-purple", "bg-pace-red", "bg-pace-green-deep", "bg-pace-amber"];

export function avatarTone(studentId: string) {
  const sum = [...studentId].reduce((total, char) => total + char.charCodeAt(0), 0);
  return tones[sum % tones.length];
}
