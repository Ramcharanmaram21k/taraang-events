// src/ai/flows/contact-form-analysis.ts
'use server';

/**
 * @fileOverview Analyzes contact form content for spam or inappropriate language.
 *
 * - analyzeContactFormContent - A function that analyzes the contact form message content.
 * - ContactFormContentAnalysisInput - The input type for the analyzeContactFormContent function.
 * - ContactFormContentAnalysisOutput - The return type for the analyzeContactFormContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContactFormContentAnalysisInputSchema = z.object({
  name: z.string().describe('The name of the person submitting the form.'),
  email: z.string().email().describe('The email address of the person submitting the form.'),
  phone: z.string().describe('The phone number of the person submitting the form.'),
  eventType: z.string().describe('The type of event the person is inquiring about.'),
  message: z.string().describe('The message content from the contact form.'),
});
export type ContactFormContentAnalysisInput = z.infer<typeof ContactFormContentAnalysisInputSchema>;

const ContactFormContentAnalysisOutputSchema = z.object({
  isSpam: z.boolean().describe('Whether the message is likely to be spam.'),
  isAppropriate: z.boolean().describe('Whether the message content is appropriate.'),
  reason: z.string().optional().describe('The reason for flagging the message, if any.'),
});
export type ContactFormContentAnalysisOutput = z.infer<typeof ContactFormContentAnalysisOutputSchema>;

export async function analyzeContactFormContent(
  input: ContactFormContentAnalysisInput
): Promise<ContactFormContentAnalysisOutput> {
  return contactFormContentAnalysisFlow(input);
}

const contactFormContentAnalysisPrompt = ai.definePrompt({
  name: 'contactFormContentAnalysisPrompt',
  input: {schema: ContactFormContentAnalysisInputSchema},
  output: {schema: ContactFormContentAnalysisOutputSchema},
  prompt: `You are an AI assistant that analyzes contact form submissions for spam and inappropriate language.

  Analyze the following contact form submission:

  Name: {{{name}}}
  Email: {{{email}}}
  Phone: {{{phone}}}
  EventType: {{{eventType}}}
  Message: {{{message}}}

  Determine if the message is spam and/or contains inappropriate language.  Provide a reason if it is flagged as such.

  Return a JSON object with the following keys:
  - isSpam: true if the message is likely to be spam, false otherwise.
  - isAppropriate: true if the message content is appropriate, false otherwise.
  - reason: A brief explanation for why the message was flagged (optional).
  `,
});

const contactFormContentAnalysisFlow = ai.defineFlow(
  {
    name: 'contactFormContentAnalysisFlow',
    inputSchema: ContactFormContentAnalysisInputSchema,
    outputSchema: ContactFormContentAnalysisOutputSchema,
  },
  async input => {
    const {output} = await contactFormContentAnalysisPrompt(input);
    return output!;
  }
);
