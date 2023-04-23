export function copyToClipboard(text: string, stock: number): void {
    const el: HTMLTextAreaElement = document.createElement('textarea');
    el.value = `~price ${text}/${stock} chaos`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  