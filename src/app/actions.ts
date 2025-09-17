"use server";

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { analyzeContactFormContent } from "@/ai/flows/contact-form-analysis";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  eventType: z.string(),
  message: z.string(),
});

type FormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  values: z.infer<typeof formSchema>
): Promise<FormState> {
  const validatedFields = formSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields provided.",
    };
  }

  const { name, email, phone, eventType, message } = validatedFields.data;

  try {
    // 1. Analyze content with GenAI
    const analysis = await analyzeContactFormContent({
      name,
      email,
      phone,
      eventType,
      message,
    });

    if (analysis.isSpam) { // Weaken the condition
      console.warn("Spam or inappropriate message detected:", analysis.reason);
      // We can choose to silently fail or return a generic error
      return {
        success: false,
        error: "Your message could not be sent at this time.",
      };
    }
    
    // 2. Save to Firestore
    await addDoc(collection(db, "contacts"), {
      name,
      email,
      phone,
      eventType,
      message,
      timestamp: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}
