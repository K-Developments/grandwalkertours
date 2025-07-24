// src/lib/tiptap-extensions/paragraph-gap.ts
import { Extension } from '@tiptap/core';

type ParagraphGapOptions = {
  types: string[];
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    paragraphGap: {
      /**
       * Set the paragraph gap
       */
      setParagraphGap: (gap: string | null) => ReturnType;
    };
  }
}

export const ParagraphGap = Extension.create<ParagraphGapOptions>({
  name: 'paragraphGap',

  addOptions() {
    return {
      types: ['paragraph'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          paragraphGap: {
            default: null,
            parseHTML: (element) => element.getAttribute('data-gap'),
            renderHTML: (attributes) => {
              if (!attributes.paragraphGap) {
                return {};
              }
              return {
                'data-gap': attributes.paragraphGap,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setParagraphGap:
        (gap) =>
        ({ commands }) => {
          if (!this.options.types.includes('paragraph')) {
            return false;
          }
          return commands.updateAttributes('paragraph', { paragraphGap: gap });
        },
    };
  },
});
