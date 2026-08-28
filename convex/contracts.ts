import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { createNotification } from "./notifications";

/**
 * Create a contract from an accepted proposal
 */
export const createContract = mutation({
  args: {
    proposalId: v.id("proposals"),
    totalPrice: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const proposal = await ctx.db.get(args.proposalId);
    if (!proposal) throw new Error("Proposal not found");
    if (proposal.status !== "accepted") {
      throw new Error("Can only create contracts for accepted proposals");
    }

    const job = await ctx.db.get(proposal.jobId);
    if (!job) throw new Error("Job not found");

    // Verify the current user is the client
    const clientProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (clientProfile.length === 0 || clientProfile[0]._id !== job.clientId) {
      throw new Error("Unauthorized to create this contract");
    }

    const designerProfile = await ctx.db.get(proposal.designerId);
    if (!designerProfile) throw new Error("Designer not found");

    const contractId = await ctx.db.insert("contracts", {
      jobId: proposal.jobId,
      proposalId: args.proposalId,
      clientId: job.clientId,
      designerId: proposal.designerId,
      status: "active",
      totalPrice: args.totalPrice,
    });

    // Notify the designer that a contract was started
    await createNotification(ctx, {
      recipientId: proposal.designerId,
      type: "contract_started",
      title: "Contract started",
      body: `A contract was started for "${job.title}".`,
      jobId: job._id,
      contractId,
      link: "/dashboard/contracts",
    });

    return contractId;
  },
});

/**
 * Update contract status
 */
export const updateContractStatus = mutation({
  args: {
    contractId: v.id("contracts"),
    status: v.union(
      v.literal("active"),
      v.literal("disputed"),
      v.literal("finished")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) throw new Error("Unauthorized");

    const contract = await ctx.db.get(args.contractId);
    if (!contract) throw new Error("Contract not found");

    // Verify user is either client or designer
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (
      profile.length === 0 ||
      (profile[0]._id !== contract.clientId && profile[0]._id !== contract.designerId)
    ) {
      throw new Error("Unauthorized to update this contract");
    }

    await ctx.db.patch(args.contractId, { status: args.status });

    const job = await ctx.db.get(contract.jobId);
    const counterpartyId =
      profile[0]._id === contract.clientId
        ? contract.designerId
        : contract.clientId;

    // If contract is finished, update job status
    if (args.status === "finished") {
      await ctx.db.patch(contract.jobId, { status: "completed" });

      await createNotification(ctx, {
        recipientId: counterpartyId,
        type: "contract_completed",
        title: "Contract completed",
        body: `The contract for "${job?.title ?? "your job"}" was marked complete.`,
        jobId: contract.jobId,
        contractId: args.contractId,
        link: "/dashboard/contracts",
      });
    } else if (args.status === "disputed") {
      await createNotification(ctx, {
        recipientId: counterpartyId,
        type: "contract_disputed",
        title: "Contract disputed",
        body: `The contract for "${job?.title ?? "your job"}" was flagged as disputed.`,
        jobId: contract.jobId,
        contractId: args.contractId,
        link: "/dashboard/contracts",
      });
    }
  },
});

/**
 * Get contract by ID
 */
export const getContractById = query({
  args: { contractId: v.id("contracts") },
  handler: async (ctx, args) => {
    const contract = await ctx.db.get(args.contractId);
    if (!contract) return null;

    const job = await ctx.db.get(contract.jobId);
    const proposal = await ctx.db.get(contract.proposalId);
    const client = await ctx.db.get(contract.clientId);
    const designer = await ctx.db.get(contract.designerId);

    return {
      ...contract,
      jobTitle: job?.title ?? "Unknown Job",
      proposalAmount: proposal?.amount,
      clientName: client?.name ?? "Anonymous",
      designerName: designer?.name ?? "Anonymous",
    };
  },
});

/**
 * Get all contracts for current user
 */
export const getMyContracts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return [];

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) return [];

    // Get contracts as client or designer
    const [clientContracts, designerContracts] = await Promise.all([
      ctx.db
        .query("contracts")
        .withIndex("by_client", (q) => q.eq("clientId", profile[0]._id))
        .collect(),
      ctx.db
        .query("contracts")
        .withIndex("by_designer", (q) => q.eq("designerId", profile[0]._id))
        .collect(),
    ]);

    const allContracts = [...clientContracts, ...designerContracts];

    // Enrich with job and counterparty info
    const contractsEnriched = await Promise.all(
      allContracts.map(async (contract) => {
        const job = await ctx.db.get(contract.jobId);
        const counterpartyId =
          contract.clientId === profile[0]._id
            ? contract.designerId
            : contract.clientId;
        const counterparty = await ctx.db.get(counterpartyId);

        return {
          ...contract,
          jobTitle: job?.title ?? "Unknown Job",
          counterpartyName: counterparty?.name ?? "Anonymous",
          counterpartyRole: contract.clientId === profile[0]._id ? "Designer" : "Client",
        };
      })
    );

    return contractsEnriched;
  },
});

/**
 * Get active contracts count for user
 */
export const getActiveContractsCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.subject;
    if (!userId) return 0;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(1);

    if (profile.length === 0) return 0;

    const [clientContracts, designerContracts] = await Promise.all([
      ctx.db
        .query("contracts")
        .withIndex("by_client", (q) => q.eq("clientId", profile[0]._id))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect(),
      ctx.db
        .query("contracts")
        .withIndex("by_designer", (q) => q.eq("designerId", profile[0]._id))
        .filter((q) => q.eq(q.field("status"), "active"))
        .collect(),
    ]);

    return clientContracts.length + designerContracts.length;
  },
});
