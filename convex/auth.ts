import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTPPasswordReset } from "./resetpassword";
import { ResendOTP } from "./resendotp";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({reset: ResendOTPPasswordReset, verify: ResendOTP}), Google]
});
