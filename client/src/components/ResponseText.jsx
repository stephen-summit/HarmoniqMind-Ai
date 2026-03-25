import React from 'react';

function renderInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function cleanText(text) {
  const lines = text.split('\n').map((line) => line.trim());

  const normalized = lines
    .filter((line) => {
      if (!line) return true;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch !== '|' && ch !== '-' && ch !== ':' && ch !== ' ') {
          return true;
        }
      }
      return false;
    })
    .map((line) => line.split('|').map((part) => part.trim()).filter(Boolean).join(' | '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return normalized;
}

function renderList(lines) {
  const ordered = lines.every((line) => /^\d+[.)]\s+/.test(line));
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <ListTag className={ordered ? 'list-decimal ml-5 space-y-1' : 'list-disc ml-5 space-y-1'}>
      {lines.map((line, idx) => {
        const item = line
          .replace(/^[-*•]\s+/, '')
          .replace(/^\d+[.)]\s+/, '');
        return <li key={idx}>{renderInline(item)}</li>;
      })}
    </ListTag>
  );
}

export default function ResponseText({ text, className = '' }) {
  if (!text) return null;

  const cleaned = cleanText(text);
  const paragraphs = cleaned.split(/\n\n+/);

  return (
    <div className={`response-text ${className}`}>
      {paragraphs.map((para, idx) => {
        const lines = para.split('\n').map((line) => line.trim()).filter(Boolean);
        const isList = lines.length > 1 && lines.every((line) => /^([-*•]\s+|\d+[.)]\s+)/.test(line));

        if (isList) {
          return <div key={idx} className="mb-3">{renderList(lines)}</div>;
        }

        return <p key={idx} className="mb-3 leading-relaxed">{renderInline(para)}</p>;
      })}
    </div>
  );
}
