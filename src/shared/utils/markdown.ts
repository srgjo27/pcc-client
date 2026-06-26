export const parseMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return '';

  let html = markdown
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Code blocks (multiline)
  html = html.replace(/```(?:[a-zA-Z]*)\n([\s\S]*?)```/g, '<pre class="bg-slate-800 text-slate-100 p-3.5 rounded-md my-3.5 font-mono text-xs overflow-x-auto border border-slate-700">$1</pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-rose-50 px-1.5 py-0.5 rounded-md font-mono text-[11px] text-rose-600 border border-rose-100 font-semibold">$1</code>');

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-sm font-bold mb-2">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-base font-bold mb-2">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-lg font-bold mb-3 border-b border-slate-100 pb-1">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // Lists
  html = html.replace(/^\s*-\s+(.*?)$/gm, '<li class="ml-4 list-disc text-sm text-slate-700 my-1">$1</li>');

  // Convert double newlines to paragraph tags, unless inside code blocks or lists
  const paragraphs = html.split(/\n\n+/);
  return paragraphs.map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<pre') || trimmed.startsWith('<li') || trimmed.startsWith('<h') || trimmed.startsWith('<li>')) {
      return p;
    }
    return `<p class="text-sm text-slate-600 leading-relaxed mb-3">${p.replace(/\n/g, '<br />')}</p>`;
  }).join('');
};
