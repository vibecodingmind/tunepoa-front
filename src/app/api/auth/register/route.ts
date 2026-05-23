import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  organizationName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create organization if provided
    let organizationId: string | null = null;
    if (validatedData.organizationName && validatedData.organizationName.trim()) {
      const organization = await db.organization.create({
        data: {
          name: validatedData.organizationName.trim(),
          email: validatedData.email,
          phone: validatedData.phone || null,
        },
      });
      organizationId = organization.id;
    }

    // Create user with CLIENT role
    const user = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        password: hashedPassword,
        role: "CLIENT",
        organizationId: organizationId,
      },
    });

    // Create a starter subscription (TRIAL status)
    await db.subscription.create({
      data: {
        userId: user.id,
        planType: "STARTER",
        status: "TRIAL",
        billingPeriod: "MONTHLY",
        amount: 0,
        maxUsers: 1,
        maxLines: 1,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
        organizationId: organizationId,
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: user.id,
        type: "USER_CREATED",
        description: "Account created successfully",
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
