import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Webhook } from "svix";

// svix requires the secret's payload (after "whsec_") to be valid base64 --
// this is a fixed, fake-but-correctly-shaped test secret, not a real one.
const WEBHOOK_SECRET = "whsec_n5HwgrEKC6yvVwEvU+ZdA79XpLTqdPlhlKYocOsoIes=";

const updateUserMetadata = vi.fn().mockResolvedValue(undefined);

vi.mock("@clerk/backend", () => ({
  createClerkClient: () => ({ users: { updateUserMetadata } }),
}));

const repositoryMocks = {
  findDefaultTenant: vi.fn().mockResolvedValue({ id: "tenant_1" }),
  findRoleByName: vi.fn().mockResolvedValue({ id: "role_parent" }),
  upsertUserByClerkId: vi.fn().mockResolvedValue({ id: "db_user_1" }),
};

vi.mock("../repository.js", () => repositoryMocks);

function signedRequest(body: unknown) {
  const payload = JSON.stringify(body);
  const svixId = "msg_test_id";
  const timestamp = new Date();
  const signature = new Webhook(WEBHOOK_SECRET).sign(svixId, timestamp, payload);

  return {
    payload,
    headers: {
      "svix-id": svixId,
      "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
      "svix-signature": signature,
    },
  };
}

const userCreatedEvent = {
  type: "user.created",
  data: {
    id: "user_123",
    primary_email_address_id: "email_1",
    email_addresses: [{ id: "email_1", email_address: "ngozi@example.com" }],
    first_name: "Ngozi",
    last_name: "Adeyemi",
    phone_numbers: [],
  },
};

describe("POST /webhooks/clerk", () => {
  beforeEach(() => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", WEBHOOK_SECRET);
    vi.clearAllMocks();
  });

  it("processes a validly-signed user.created event", async () => {
    const { createApp } = await import("../../../app.js");
    const { payload, headers } = signedRequest(userCreatedEvent);

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set(headers)
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, handled: true });
    expect(repositoryMocks.upsertUserByClerkId).toHaveBeenCalledWith(
      expect.objectContaining({ clerkId: "user_123", email: "ngozi@example.com" })
    );
    expect(updateUserMetadata).toHaveBeenCalledWith("user_123", {
      publicMetadata: { role: "parent" },
    });
  });

  it("rejects a request with an invalid signature", async () => {
    const { createApp } = await import("../../../app.js");
    const { payload } = signedRequest(userCreatedEvent);

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set("svix-id", "msg_test_id")
      .set("svix-timestamp", Math.floor(Date.now() / 1000).toString())
      .set("svix-signature", "v1,tampered-signature")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(401);
    expect(repositoryMocks.upsertUserByClerkId).not.toHaveBeenCalled();
  });

  it("rejects a request missing svix headers", async () => {
    const { createApp } = await import("../../../app.js");

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set("Content-Type", "application/json")
      .send(JSON.stringify(userCreatedEvent));

    expect(response.status).toBe(400);
  });

  it("acknowledges but does not overwrite a role the API already set", async () => {
    const { createApp } = await import("../../../app.js");
    const { payload, headers } = signedRequest({
      ...userCreatedEvent,
      data: { ...userCreatedEvent.data, public_metadata: { role: "tutor" } },
    });

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set(headers)
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, handled: true });
    expect(repositoryMocks.upsertUserByClerkId).not.toHaveBeenCalled();
    expect(updateUserMetadata).not.toHaveBeenCalled();
  });

  it("acknowledges but ignores an event type it doesn't handle", async () => {
    const { createApp } = await import("../../../app.js");
    const { payload, headers } = signedRequest({ type: "user.updated", data: {} });

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set(headers)
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, handled: false });
    expect(repositoryMocks.upsertUserByClerkId).not.toHaveBeenCalled();
  });

  it("returns 500 when the webhook secret isn't configured", async () => {
    vi.unstubAllEnvs();
    const { createApp } = await import("../../../app.js");
    const { payload, headers } = signedRequest(userCreatedEvent);

    const response = await request(createApp())
      .post("/webhooks/clerk")
      .set(headers)
      .set("Content-Type", "application/json")
      .send(payload);

    expect(response.status).toBe(500);
  });
});
