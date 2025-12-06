export type MessageContentTextDetail = {
  type: "text";
  text: string;
};

export type MessageContentImageDetail = {
  type: "image_url";
  image_url: { url: string };
  detail?: "high" | "low" | "auto";
};

export type MessageContentAudioDetail = {
  type: "audio";
  // this is a base64 encoded string
  data: string;
  mimeType: string;
};

export type MessageContentVideoDetail = {
  type: "video";
  // this is a base64 encoded string
  data: string;
  mimeType: string;
};

export type MessageContentImageDataDetail = {
  type: "image";
  // this is a base64 encoded string
  data: string;
  mimeType: string;
};

export type MessageContentFileDetail = {
  type: "file";
  // this is a base64 encoded string
  data: string;
  mimeType: string;
};

export type MessageContentDetail =
  | MessageContentTextDetail
  | MessageContentImageDetail
  | MessageContentAudioDetail
  | MessageContentVideoDetail
  | MessageContentImageDataDetail
  | MessageContentFileDetail;

/**
 * Extended type for the content of a message that allows for multi-modal messages.
 */
export type MessageContent = string | MessageContentDetail[];
