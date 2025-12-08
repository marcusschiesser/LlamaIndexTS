/**
 * This example demonstrates using @huggingface/transformers directly
 * to create CLIP embeddings for text and images.
 */

import {
  AutoProcessor,
  AutoTokenizer,
  CLIPTextModelWithProjection,
  CLIPVisionModelWithProjection,
  RawImage,
} from "@huggingface/transformers";
import { similarity, SimilarityType } from "llamaindex";

// Model ID for CLIP
const MODEL_ID = "Xenova/clip-vit-base-patch32";

// Initialize models lazily
let textModel: CLIPTextModelWithProjection | null = null;
let visionModel: CLIPVisionModelWithProjection | null = null;
let tokenizer: Awaited<
  ReturnType<typeof AutoTokenizer.from_pretrained>
> | null = null;
let processor: Awaited<
  ReturnType<typeof AutoProcessor.from_pretrained>
> | null = null;

async function getTextModel() {
  if (!textModel) {
    textModel = await CLIPTextModelWithProjection.from_pretrained(MODEL_ID);
  }
  return textModel;
}

async function getVisionModel() {
  if (!visionModel) {
    visionModel = await CLIPVisionModelWithProjection.from_pretrained(MODEL_ID);
  }
  return visionModel;
}

async function getTokenizer() {
  if (!tokenizer) {
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID);
  }
  return tokenizer;
}

async function getProcessor() {
  if (!processor) {
    processor = await AutoProcessor.from_pretrained(MODEL_ID);
  }
  return processor;
}

// Get text embedding using CLIP
async function getTextEmbedding(text: string): Promise<number[]> {
  const model = await getTextModel();
  const tok = await getTokenizer();

  const textInputs = tok(text, { padding: true, truncation: true });
  const { text_embeds } = await model(textInputs);

  return Array.from(text_embeds.data as Float32Array);
}

// Get image embedding using CLIP
async function getImageEmbedding(imageUrl: string): Promise<number[]> {
  const model = await getVisionModel();
  const proc = await getProcessor();

  const image = await RawImage.fromURL(imageUrl);
  const imageInputs = await proc(image);
  const { image_embeds } = await model(imageInputs);

  return Array.from(image_embeds.data as Float32Array);
}

async function main() {
  // Get text embeddings
  const text1 = "a car";
  const textEmbedding1 = await getTextEmbedding(text1);
  const text2 = "a football match";
  const textEmbedding2 = await getTextEmbedding(text2);

  // Get image embedding
  const imageUrl =
    "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/football-match.jpg";
  const imageEmbedding = await getImageEmbedding(imageUrl);

  // Calc similarity
  const sim1 = similarity(
    textEmbedding1,
    imageEmbedding,
    SimilarityType.DEFAULT,
  );
  const sim2 = similarity(
    textEmbedding2,
    imageEmbedding,
    SimilarityType.DEFAULT,
  );

  console.log(`Similarity between "${text1}" and the image is ${sim1}`);
  console.log(`Similarity between "${text2}" and the image is ${sim2}`);
}

void main();
