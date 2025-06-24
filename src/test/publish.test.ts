import axios from "axios";
import { publishToWebHook } from "../publish";
import { TargetOrderModel } from "../types";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("publishToWebHook", () => {
  const data: TargetOrderModel = {
    order: {
      id: "ORD-123",
      createdAt: "2023-10-15",
      customer: { id: "CUST-789" },
      location: { storeId: "42" },
      status: "new",
      payment: {
        method: "CREDIT_CARD",
        total: 104.97,
      },
      shipping: {
        address: {
          line1: "123 Main St",
          city: "Columbus",
          state: "OH",
          postalCode: "43215",
          country: "USA",
        },
      },
    },
    items: [
      {
        productId: "PROD-001",
        quantity: 2,
        price: {
          base: 29.99,
          discount: 5.0,
          final: 49.98,
        },
      },
    ],
    metadata: {
      source: "order_producer",
      notes: "Please deliver after 5pm",
      processedAt: new Date().toISOString(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("test should send data successfully when WEBHOOK_URL is defined", async () => {
    process.env.WEBHOOK_URL = "https://webhook.site/fake-id";
    mockedAxios.post.mockResolvedValue({status : 200});//so when someone makes a post request to the api, it returns the mocked response as a promise

    await expect(publishToWebHook(data)).resolves.toBeUndefined();
    expect(mockedAxios.post).toHaveBeenCalledWith(
      process.env.WEBHOOK_URL,
      data,
      {
        headers: 
         {"Content-Type": "application/json"} 
      }
    );
  });

  test("test should throw an error when WEBHOOK_URL is missing", async () => {
    delete process.env.WEBHOOK_URL;
    await expect(publishToWebHook(data)).rejects.toThrow("No URL in environmental variables");
  });

  test("test should throw error when axios.post fails", async () => {
    process.env.WEBHOOK_URL = "https://webhook.site/fail";
    mockedAxios.post.mockRejectedValue(new Error("Webhook failed"));

    await expect(publishToWebHook(data)).rejects.toThrow("Webhook failed");
    // expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
