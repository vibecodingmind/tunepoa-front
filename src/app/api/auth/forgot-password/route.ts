import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import crypto from "crypto";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a password reset link." },
        { status: 200 }
      );
    }

    // Create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.verificationToken.create({
      data: {
        identifier: validatedData.email,
        token: token,
        expires: expires,
      },
    });

    // TODO: Send email with reset link
    // For now, we just create the token and return success
    // In production, integrate with an email service like SendGrid, Resend, etc.

    return NextResponse.json(
      { message: "If an account exists with this email, you will receive a password reset link." },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
