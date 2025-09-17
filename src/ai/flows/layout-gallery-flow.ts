'use server';
/**
 * @fileOverview An AI flow for generating a gallery layout.
 *
 * - layoutGallery - A function that generates a gallery layout.
 * - LayoutGalleryInput - The input type for the layoutGallery function.
 * - GalleryLayout - The return type for the layoutGallery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImageInfoSchema = z.object({
  id: z.string().describe('The unique identifier for the image.'),
  description: z.string().describe('A description of the image content.'),
  hint: z.string().describe('Keywords for the image content.'),
  url: z
    .string()
    .describe(
      'The URL or data URI of the image.'
    ),
});

const LayoutGalleryInputSchema = z.object({
  images: z.array(ImageInfoSchema).describe('An array of available images.'),
});
export type LayoutGalleryInput = z.infer<typeof LayoutGalleryInputSchema>;

const LayoutItemSchema = z.object({
  id: z.string().describe('The ID of the image to be placed in the grid.'),
  colSpan: z
    .number()
    .min(1)
    .max(4)
    .describe('The number of columns the image should span.'),
  rowSpan: z
    .number()
    .min(1)
    .max(2)
    .describe('The number of rows the image should span.'),
});

const GalleryLayoutSchema = z.object({
  layout: z
    .array(LayoutItemSchema)
    .describe(
      'An array of layout items that describe the gallery grid.'
    ),
});
export type GalleryLayout = z.infer<typeof GalleryLayoutSchema>;

export async function layoutGallery(
  input: LayoutGalleryInput
): Promise<GalleryLayout> {
  return layoutGalleryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'layoutGalleryPrompt',
  input: {schema: LayoutGalleryInputSchema},
  output: {schema: GalleryLayoutSchema},
  prompt: `You are an expert web designer tasked with creating a visually stunning masonry-style photo gallery.

You will be given a list of images with their descriptions and content hints. Your job is to generate a layout for a 4-column grid.

Rules for the layout:
- The grid has a total of 4 columns.
- An item's colSpan can be 1 or 2. An item's rowSpan can be 1 or 2.
- The total column span of all items in a logical row should not exceed 4.
- Create a dynamic and visually interesting layout. Avoid a simple uniform grid.
- Try to make larger, more prominent images (e.g., colSpan=2, rowSpan=2) for those with "event decoration" or "indian wedding" hints, or for images that seem important.
- The total number of items in the layout should be equal to the number of images provided.
- Ensure the final layout is a valid JSON object that adheres to the provided schema.
- Use the provided image URLs in the layout.

Available images:
{{#each images}}
- ID: {{id}}, Description: {{description}}, Hint: {{hint}}, URL: {{#if url}}{{media url=url}}{{else}}N/A{{/if}}
{{/each}}
`,
});

const layoutGalleryFlow = ai.defineFlow(
  {
    name: 'layoutGalleryFlow',
    inputSchema: LayoutGalleryInputSchema,
    outputSchema: GalleryLayoutSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
