/* SPDX-FileCopyrightText: 2016-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import SendGrid from "@sendgrid/mail";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { BadRequest } from "http-errors";
import { nanoid } from "nanoid/async";
import { ValidationError } from "validator-fluent";
import { Context } from "../core/index.js";
import env from "../env.js";

/**
 * @example
 *   mutation {
 *     signIn(input: { email: "user@example.com", saml: false }) {
 *       newUser
 *       emailVerified
 *       otpSent
 *     }
 *   }
 */
export const signIn: GraphQLFieldConfig<unknown, Context> = {
  description: "Get sign-in options and/or sends OTP code.",

  type: new GraphQLObjectType({
    name: "SignInPayload",
    fields: {
      newUser: { type: new GraphQLNonNull(GraphQLBoolean) },
      emailVerified: { type: new GraphQLNonNull(GraphQLBoolean) },
      registered: { type: new GraphQLNonNull(GraphQLBoolean) },
      saml: { type: new GraphQLNonNull(GraphQLString) },
      otpSent: { type: GraphQLBoolean },
      token: { type: GraphQLString },
    },
  }),

  args: {
    input: {
      type: new GraphQLInputObjectType({
        name: "SignInInput",
        fields: {
          email: { type: GraphQLString },
          otp: { type: GraphQLString },
          saml: { type: GraphQLBoolean, defaultValue: false },
        },
      }),
    },
  },

  async resolve(self, args): Promise<SignInResponse> {
    const input: SignInInput = args.input;

    if (!input.email) {
      throw new ValidationError({ email: ["Email cannot be empty."] });
    }

    // Check if the user account already exists
    const auth = getAuth();
    let user = await auth
      .getUserByEmail(input.email)
      .catch((err) =>
        err.code === "auth/user-not-found"
          ? Promise.resolve(null)
          : Promise.reject(err),
      );

    if (user?.disabled) {
      throw new BadRequest("Your user account was disabled.");
    }

    if (user && input.saml) {
      return {
        newUser: false,
        emailVerified: user.emailVerified,
        registered: false, // TODO
        saml: "unavailable",
      };
    }

    // Attempt to fetch the previously generated OTP code if exists
    const otpRef = getFirestore().collection("otps").doc(input.email);
    const doc = await otpRef.get();
    const updated = doc.updateTime?.toMillis() ?? 0;
    let otp = doc?.data();

    // Check if the OTP code exists and is not expired (15 min)
    const otpExists =
      doc.exists &&
      updated > Date.now() - 9e5 &&
      (otp?.failedAttempts ?? 0 < 5);

    if (input.otp) {
      if (otpExists && otp?.code === input.otp) {
        if (!user) {
          user = await auth.createUser({
            uid: await nanoid(6),
            email: input.email,
            emailVerified: true,
          });
        } else if (!user.emailVerified) {
          await auth.updateUser(user.uid, { emailVerified: true });
        }

        await otpRef.delete();

        return {
          newUser: false,
          emailVerified: user.emailVerified,
          registered: false, // TODO
          saml: "unavailable",
          token: await auth.createCustomToken(user.uid),
        };
      } else {
        await otpRef.set(
          { failedAttempts: (otp?.failedAttempts ?? 0) + 1 },
          { merge: true },
        );

        throw new BadRequest("The OTP code is invalid or expired.");
      }
    }

    if (!otpExists) {
      otp = { code: generateOTP() };
      await otpRef.set(otp);
    }

    // Send OTP code
    await SendGrid.send({
      to: input.email,
      from: `${env.APP_NAME} <${env.EMAIL_FROM}>`,
      templateId: "d-325441f6419543c99baf74933d2ac815",
      dynamicTemplateData: { code: otp?.code },
    });

    return {
      newUser: user ? false : true,
      emailVerified: user?.emailVerified ?? false,
      registered: false, // TODO
      saml: "unavailable",
      otpSent: true,
    };
  },
};

/**
 * Generates a 6-digit OTP code, e.g. "608230"
 */
function generateOTP() {
  const digits = "0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += digits[Math.floor(Math.random() * 10)];
  }

  return code;
}

// #region TypeScript declarations

type SignInInput = {
  email?: string | null;
  saml?: boolean | null;
  otp?: string | null;
};

type SignInResponse = {
  newUser: boolean;
  emailVerified: boolean;
  registered: boolean;
  saml: "unavailable";
  otpSent?: boolean;
  token?: string;
};

// #endregion
