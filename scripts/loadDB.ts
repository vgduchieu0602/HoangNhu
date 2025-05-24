import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";

/**=== dot_proudct (tích vô hướng) ===
 * Gía trị càng lớn thì vector càng tương đồng
 * Thường được sử dụng khi các vector đã được chuẩn hóa
 */
/**=== cosine ===
 * Đo lường góc giữa 2 vector
 * Kết quả nằm trong khoảng [-1, 1]
 * 1: 2 vector hoàn toàn giống nhau
 * 0: 2 vector không liên quan
 * -1: 2 vector đối nghịch nhau
 */
/**=== euclidean (khoảng cách Euclidean) ===
 * Đo lường khoảng cách trực tiếp giữa 2 điểm trong không gian
 * Gía trị càng nhỏ thì 2 vector càng tương đồng
 * Thường được sử dụng khi cần đo lường khoảng cách thực tế
 */
type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const nuuData = ["https://nhathuoclongchau.com.vn/"];

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async (
  similarityMetric: SimilarityMetric = "dot_product"
) => {
  try {
    // Try to create collection
    const res = await db.createCollection(ASTRA_DB_COLLECTION, {
      vector: {
        dimension: 1536,
        metric: similarityMetric,
      },
    });
    console.log("Collection created successfully:", res);
  } catch (error: any) {
    // If collection already exists, just log and continue
    if (error.message?.includes("already exists")) {
      console.log("Collection already exists, proceeding with data loading...");
    } else {
      // If it's a different error, throw it
      throw error;
    }
  }
};

const loadSampleData = async () => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    for await (const url of nuuData) {
      console.log(`Processing URL: ${url}`);
      const content = await scrapePage(url);
      const chunks = await splitter.splitText(content);
      for await (const chunk of chunks) {
        const embedding = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: chunk,
          encoding_format: "float",
        });

        const vector = embedding.data[0].embedding;

        const res = await collection.insertOne({
          $vector: vector,
          text: chunk,
          url: url, // Adding URL to track source
          timestamp: new Date(), // Adding timestamp
        });
        console.log("Inserted document:", res);
      }
    }
    console.log("Data loading completed successfully!");
  } catch (error) {
    console.error("Error loading data:", error);
    throw error;
  }
};

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });

  return (await loader.scrape())?.replace(/<[^>]*>?/gm, "");
};

createCollection().then(() => loadSampleData());
