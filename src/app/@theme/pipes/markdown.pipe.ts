import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import marked from 'marked';

// constants
const mdRenderer = new marked.Renderer();
mdRenderer.link = (href, title, text) =>
  `<a target="_blank" href="${href}" title="${title}" rel="noreferrer noopener">${text}</a>`;

@Pipe({
  name: 'markdown',
  pure: true,
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}

  transform(value: string): any {
    const html = marked.parseInline(value, { renderer: mdRenderer });
    const output = this.sanitized.bypassSecurityTrustHtml(html);
    return output;
  }
}
