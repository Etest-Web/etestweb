const clerkProvider = {
  domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
  applicationID: "convex",
};

export default {
  providers: [clerkProvider],
};
