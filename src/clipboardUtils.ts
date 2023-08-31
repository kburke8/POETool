export function copyToClipboard(text: string, stock: number, currency: string): void {
    const el: HTMLTextAreaElement = document.createElement('textarea');
    el.value = `~price ${text}/${stock} ${currency}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }
  