"use server";

import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUpUser(formData: {
  name?: string;
  email: string;
  password: string;
}) {
  const parsed = signUpSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || normalizedEmail.split("@")[0],
        full_name: name?.trim() || null,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "Account created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  } catch (error) {
    console.error("Sign-up error:", error);
    return {
      success: false,
      message: "An unexpected error occurred during sign-up",
    };
  }
}

export async function requestPasswordReset(email: string) {
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "Please provide a valid email address",
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // For security, don't leak user existence; return success message
    if (!user) {
      return {
        success: true,
        message: "If an account exists with that email, a password reset link has been sent.",
      };
    }

    // Clean up any existing reset tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: { email: normalizedEmail },
    });

    // Generate secure 32-byte hex token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour validity

    await prisma.passwordResetToken.create({
      data: {
        email: normalizedEmail,
        token,
        expires,
      },
    });

    await sendPasswordResetEmail(normalizedEmail, token);

    return {
      success: true,
      message: "If an account exists with that email, a password reset link has been sent.",
    };
  } catch (error) {
    console.error("Password reset request error:", error);
    return {
      success: false,
      message: "Failed to process password reset request. Please try again later.",
    };
  }
}

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  token: z.string().min(1, "Invalid or missing token"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function resetPassword(formData: {
  email: string;
  token: string;
  newPassword: string;
}) {
  const parsed = resetPasswordSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid input data",
    };
  }

  const { email, token, newPassword } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { email_token: { email: normalizedEmail, token } },
    });

    if (!resetRecord) {
      return {
        success: false,
        message: "Invalid or expired password reset link",
      };
    }

    if (new Date() > resetRecord.expires) {
      // Remove expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
      return {
        success: false,
        message: "This password reset link has expired. Please request a new one.",
      };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { email: normalizedEmail },
      data: { password: hashedPassword },
    });

    // Delete token after successful reset
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id },
    });

    return {
      success: true,
      message: "Your password has been reset successfully. You can now sign in.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      message: "An error occurred while resetting your password",
    };
  }
}
