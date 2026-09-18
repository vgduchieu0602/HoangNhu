import { DataAPIClient } from "@datastax/astra-db-ts";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

import OpenAI from "openai";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const sourceUrl = process.env.KNOWLEDGE_BASE_SOURCE_URL;

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
      console.error("Error creating collection:", error);
      throw error;
    }
  }
};

const loadSampleData = async (url: string) => {
  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    console.log(`Processing URL: ${url}`);
    const content = await scrapePage(url);

    if (!content?.trim()) {
      throw new Error(`No extractable content found for ${url}`);
    }

    const chunks = await splitter.splitText(content);
    if (chunks.length === 0) {
      throw new Error(`No chunks created for ${url}`);
    }

    const deleteResult = await collection.deleteMany({ url });
    console.log(
      `Removed ${deleteResult.deletedCount ?? 0} existing chunks for ${url}`
    );

    for (const [index, chunk] of chunks.entries()) {
      try {
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
        console.log(`Inserted chunk ${index + 1}/${chunks.length}:`, res);
      } catch (error) {
        console.error(
          `Failed to index chunk ${index + 1}/${chunks.length} for ${url}:`,
          error
        );
        throw error;
      }
    }
    console.log(`Data loading completed successfully for ${url}!`);
  } catch (error) {
    console.error(`Error loading data for ${url}:`, error);
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

const main = async () => {
  const requiredEnvVars = [
    "ASTRA_DB_NAMESPACE",
    "ASTRA_DB_COLLECTION",
    "ASTRA_DB_API_ENDPOINT",
    "ASTRA_DB_APPLICATION_TOKEN",
    "OPENAI_API_KEY",
    "KNOWLEDGE_BASE_SOURCE_URL",
  ];
  const missingEnvVars = requiredEnvVars.filter(
    (name) => !process.env[name]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(", ")}`
    );
  }

  await createCollection();
  await loadSampleData(sourceUrl);
};

main().catch((error) => {
  console.error("Ingestion failed:", error);
  process.exitCode = 1;
});
