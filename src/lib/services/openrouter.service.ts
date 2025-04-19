/**
 * OpenRouter Service
 * Service for integrating with OpenRouter API for LLM-based chats
 */

import { z } from "zod";

// Types and interfaces
export interface OpenRouterConfig {
  systemMessage?: string;
  userMessage?: string;
  responseFormat?: ResponseFormat;
  modelName?: string;
  modelParameters?: ModelParameters;
}

export interface ModelParameters {
  temperature?: number;
  max_tokens?: number;
  [key: string]: unknown;
}

export interface ResponseFormat {
  type: "json_schema";
  json_schema: {
    name: string;
    strict: boolean;
    schema: Record<string, unknown>;
  };
}

export type ChatResponse = Record<string, unknown>;

/**
 * Interface for HTTP client
 */
interface HttpClient {
  post: (
    url: string,
    data: Record<string, unknown>,
    headers: Record<string, string>
  ) => Promise<Record<string, unknown>>;
}

/**
 * Service for integrating with OpenRouter API
 */
export class OpenRouterService {
  private apiKey: string;
  private apiEndpoint: string;
  private modelName: string;
  private modelParameters: ModelParameters;
  private _config: OpenRouterConfig;
  private _httpClient: HttpClient;
  private _responseValidator: z.ZodType<unknown> | null = null;

  /**
   * Constructor for OpenRouterService
   * @param config Configuration for the service
   */
  constructor(config?: OpenRouterConfig) {
    // Initialize from environment variables
    this.apiKey = import.meta.env.OPENROUTER_API_KEY || "";
    this.apiEndpoint = import.meta.env.OPENROUTER_API_ENDPOINT || "https://openrouter.ai/api/v1/chat/completions";

    // Set default values
    this.modelName = "gpt-4o-mini";
    this.modelParameters = {
      temperature: 0.7,
      max_tokens: 1000,
    };

    this._config = {
      systemMessage: "You are a helpful assistant dedicated to providing detailed and accurate responses.",
      userMessage: "Please, provide the necessary details for your request.",
      // Wyłączamy domyślny format JSON, ponieważ powoduje problemy z walidacją odpowiedzi
      // responseFormat: {
      //   type: "json_schema",
      //   json_schema: {
      //     name: "ChatResponseSchema",
      //     strict: true,
      //     schema: {
      //       message: "string",
      //       timestamp: "string",
      //     },
      //   },
      // },
    };

    // Override defaults with provided config
    if (config) {
      this.configure(config);
    }

    // Initialize HTTP client (we'll use fetch API for now)
    this._httpClient = this._initHttpClient();

    // Initialize response validator based on schema
    this._initResponseValidator();
  }

  /**
   * Initialize HTTP client
   * @returns HTTP client instance
   */
  private _initHttpClient(): HttpClient {
    // For now, we'll use native fetch, but this could be replaced with axios or another HTTP client
    return {
      post: async (url: string, data: Record<string, unknown>, headers: Record<string, string>) => {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            ...headers,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return (await response.json()) as Record<string, unknown>;
      },
    };
  }

  /**
   * Initialize the response validator based on the JSON schema
   */
  private _initResponseValidator(): void {
    if (!this._config.responseFormat?.json_schema?.schema) {
      this._responseValidator = null;
      return;
    }

    try {
      // Create Zod schema from JSON schema
      this._responseValidator = this._createZodSchemaFromJsonSchema(this._config.responseFormat.json_schema.schema);
    } catch (error) {
      console.error("Failed to create response validator:", error);
      this._responseValidator = null;
    }
  }

  /**
   * Create a Zod schema from a JSON schema
   * @param schema JSON schema
   * @returns Zod schema
   */
  private _createZodSchemaFromJsonSchema(schema: Record<string, unknown>): z.ZodType<unknown> {
    // Create an object with Zod validators for each property
    const schemaEntries = Object.entries(schema);
    const zodSchema: Record<string, z.ZodType<unknown>> = {};

    for (const [key, type] of schemaEntries) {
      if (type === "string") {
        zodSchema[key] = z.string();
      } else if (type === "number") {
        zodSchema[key] = z.number();
      } else if (type === "boolean") {
        zodSchema[key] = z.boolean();
      } else if (type === "array") {
        zodSchema[key] = z.array(z.unknown());
      } else if (type === "object") {
        zodSchema[key] = z.record(z.unknown());
      } else {
        // Default to any type if not recognized
        zodSchema[key] = z.unknown();
      }
    }

    return z.object(zodSchema);
  }

  /**
   * Configure the service
   * @param config Configuration options
   */
  public configure(config: OpenRouterConfig): void {
    this._config = {
      ...this._config,
      ...config,
    };

    if (config.modelName) {
      this.modelName = config.modelName;
    }

    if (config.modelParameters) {
      this.modelParameters = {
        ...this.modelParameters,
        ...config.modelParameters,
      };
    }

    // Reinitialize validator if response format has changed
    if (config.responseFormat) {
      this._initResponseValidator();
    }
  }

  /**
   * Build the request body for the OpenRouter API
   * @param message User message to send
   * @returns Request body object
   */
  private _buildRequestBody(message: string): Record<string, unknown> {
    const messages = [];

    // Add system message if available
    if (this._config.systemMessage) {
      messages.push({
        role: "system",
        content: this._config.systemMessage,
      });
    }

    // Add user message
    messages.push({
      role: "user",
      content: message,
    });

    // Build request body
    const requestBody: Record<string, unknown> = {
      model: this.modelName,
      messages: messages,
      ...this.modelParameters,
    };

    // Add response format if available
    if (this._config.responseFormat) {
      requestBody.response_format = this._config.responseFormat;
    }

    return requestBody;
  }

  /**
   * Validate the response from OpenRouter API
   * @param response Response from the API
   * @returns True if the response is valid, false otherwise
   */
  private _validateResponse(response: Record<string, unknown>): boolean {
    // Debug log to see the actual response structure
    console.log("OpenRouter API Response:", JSON.stringify(response, null, 2));

    // Check if the response has the necessary fields
    if (!response || typeof response !== "object") {
      console.log("Response is not an object");
      return false;
    }

    // Jeśli odpowiedź zawiera pole "content", to zakładamy, że jest to bezpośrednia odpowiedź
    if (response.content && typeof response.content === "string") {
      return true;
    }

    // Check if the response has choices
    if (!response.choices || !Array.isArray(response.choices) || response.choices.length === 0) {
      console.log("Response does not have valid choices array");
      // Sprawdź alternatywną strukturę odpowiedzi
      if (response.error) {
        console.error("API returned an error:", response.error);
        throw new Error(`OpenRouter API error: ${JSON.stringify(response.error)}`);
      }
      return false;
    }

    // Check if the first choice has a message
    const firstChoice = response.choices[0] as Record<string, unknown>;
    if (!firstChoice.message || typeof firstChoice.message !== "object") {
      console.log("First choice does not have a valid message object");
      return false;
    }

    // If response format is specified with json_schema, validate against the schema
    if (this._config.responseFormat?.type === "json_schema") {
      const message = firstChoice.message as Record<string, unknown>;
      if (!message.content || typeof message.content !== "string") {
        console.log("Message does not have valid content string");
        return false;
      }

      try {
        // Parse the content as JSON
        const content = JSON.parse(message.content as string);

        // Validate against the schema if we have a validator
        if (this._responseValidator) {
          const result = this._responseValidator.safeParse(content);
          if (!result.success) {
            console.log("JSON validation failed:", result.error.message);
          }
          return result.success;
        }

        // Fallback to basic validation
        return content && typeof content === "object";
      } catch (error) {
        console.log("Failed to parse content as JSON:", error);
        // Jeśli nie możemy sparsować jako JSON, ale mamy treść, to akceptujemy ją jako zwykły string
        return true;
      }
    }

    return true;
  }

  /**
   * Handle errors from the OpenRouter API
   * @param error Error object
   */
  private _handleError(error: Error): void {
    console.error("OpenRouter API Error:", error.message);

    // Add more sophisticated error handling here
    // For example, retry logic, logging, or alerting
  }

  /**
   * Send a chat request to the OpenRouter API
   * @param message User message to send
   * @returns Chat response
   */
  public async sendChatRequest(message: string): Promise<ChatResponse> {
    try {
      // Build request body
      const requestBody = this._buildRequestBody(message);

      // Send request to OpenRouter API
      const response = await this._httpClient.post(
        this.apiEndpoint,
        requestBody,
        {} // Additional headers if needed
      );

      // Validate response
      if (!this._validateResponse(response)) {
        throw new Error("Invalid response from OpenRouter API");
      }

      // Parse and return response
      return this.parseResponse(response);
    } catch (error) {
      this._handleError(error as Error);
      throw error;
    }
  }

  /**
   * Parse the response from OpenRouter API
   * @param response Response from the API
   * @returns Parsed chat response
   */
  public parseResponse(response: Record<string, unknown>): ChatResponse {
    try {
      // Sprawdź, czy odpowiedź zawiera bezpośrednio pole content
      if (response.content && typeof response.content === "string") {
        return {
          content: response.content,
          role: response.role || "assistant",
        } as ChatResponse;
      }

      // Extract message from the first choice
      const choices = response.choices as Record<string, unknown>[];
      const firstChoice = choices[0];
      const message = firstChoice.message as Record<string, unknown>;

      // If response format is specified with json_schema, parse the content as JSON
      if (this._config.responseFormat?.type === "json_schema" && message.content) {
        try {
          const content = JSON.parse(message.content as string);

          // Validate against schema if we have a validator
          if (this._responseValidator) {
            const result = this._responseValidator.safeParse(content);
            if (!result.success) {
              console.warn(`JSON validation failed: ${result.error.message}`);
              // Mimo błędu walidacji, zwróćmy zawartość jako odpowiedź tekstową
              return {
                content: message.content as string,
                role: message.role || "assistant",
              } as ChatResponse;
            }
          }

          return content as ChatResponse;
        } catch (error) {
          console.warn(`Failed to parse JSON response: ${error instanceof Error ? error.message : "Unknown error"}`);
          // Jeśli nie udało się sparsować JSON, zwróćmy zawartość jako zwykły tekst
          return {
            content: message.content as string,
            role: message.role || "assistant",
          } as ChatResponse;
        }
      }

      // If no response format is specified, return the message itself
      return {
        content: message.content,
        role: message.role || "assistant",
      } as ChatResponse;
    } catch (error) {
      this._handleError(error as Error);
      // W przypadku błędu, spróbujmy zwrócić surową odpowiedź
      if (response && typeof response === "object") {
        if (typeof response.content === "string") {
          return { content: response.content } as ChatResponse;
        } else if (response.choices && Array.isArray(response.choices) && response.choices.length > 0) {
          const firstChoice = response.choices[0] as Record<string, unknown>;
          if (firstChoice.message && typeof firstChoice.message === "object") {
            const message = firstChoice.message as Record<string, unknown>;
            if (typeof message.content === "string") {
              return { content: message.content } as ChatResponse;
            }
          }
        }
      }

      throw error;
    }
  }
}
