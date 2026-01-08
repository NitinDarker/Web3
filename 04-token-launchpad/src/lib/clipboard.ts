export function copyToClipboard(text: string, label: string): void {
  navigator.clipboard.writeText(text);
  alert(`${label} copied to clipboard!`);
}
