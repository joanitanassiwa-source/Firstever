import { Fragment } from "react";

/**
 * Editable copy blocks support a single inline convention: {i}…{/i} for
 * italics. Kept deliberately minimal so the admin textareas stay plain text
 * and nothing user-entered is ever passed to dangerouslySetInnerHTML.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\{i\}.*?\{\/i\})/gs);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\{i\}(.*?)\{\/i\}$/s);
        if (match) return <em key={i}>{match[1]}</em>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
