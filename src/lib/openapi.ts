const categoryValues = [
  "PERSONAL",
  "ACADEMIC",
  "SOCIAL",
  "EMOTIONAL_WELLBEING",
  "OTHER",
];

const audienceValues = [
  "STUDENT",
  "UNIVERSITY_STUDENT",
  "PARENT_OR_GUARDIAN",
  "OTHER",
];

const urgencyValues = ["CONSULTATION", "SOON", "UNSAFE_NOW"];

const errorResponse = {
  description: "Request gagal diproses.",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/ApiError" },
    },
  },
};

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Layanan Pengaduan BK API",
    version: "1.0.0",
    description:
      "Kontrak publik untuk mengirim pengaduan dan memeriksa status terbatas menggunakan kode pelacakan.",
  },
  servers: [{ url: "/", description: "Origin aplikasi saat ini" }],
  tags: [{ name: "Complaints", description: "Pengaduan publik" }],
  paths: {
    "/api/v1/complaints": {
      post: {
        tags: ["Complaints"],
        summary: "Kirim pengaduan",
        description:
          "Memvalidasi dan menyimpan pengaduan. Nama dan kontak diabaikan ketika isAnonymous bernilai true.",
        operationId: "createComplaint",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ComplaintSubmission" },
            },
          },
        },
        responses: {
          "201": {
            description: "Pengaduan tersimpan.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ComplaintResponse" },
              },
            },
          },
          "400": errorResponse,
          "413": errorResponse,
          "415": errorResponse,
          "422": errorResponse,
          "500": errorResponse,
          "503": errorResponse,
        },
      },
    },
    "/api/v1/complaints/{trackingCode}": {
      get: {
        tags: ["Complaints"],
        summary: "Lacak pengaduan",
        description:
          "Mengembalikan kode, waktu penerimaan, dan status publik tanpa identitas atau isi pengaduan.",
        operationId: "trackComplaint",
        parameters: [
          {
            in: "path",
            name: "trackingCode",
            required: true,
            schema: {
              type: "string",
              minLength: 8,
              maxLength: 64,
              pattern: "^[A-Za-z0-9-]+$",
              example: "BK-0123456789ABCDEF0123",
            },
          },
        ],
        responses: {
          "200": {
            description: "Status publik pengaduan.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ComplaintResponse" },
              },
            },
          },
          "404": errorResponse,
          "500": errorResponse,
          "503": errorResponse,
        },
      },
    },
  },
  components: {
    schemas: {
      ComplaintSubmission: {
        type: "object",
        additionalProperties: false,
        required: [
          "audience",
          "category",
          "consent",
          "details",
          "isAnonymous",
          "title",
          "urgency",
        ],
        properties: {
          audience: { type: "string", enum: audienceValues },
          category: { type: "string", enum: categoryValues },
          consent: { type: "boolean", const: true },
          contact: { type: "string", maxLength: 120 },
          details: { type: "string", minLength: 10, maxLength: 2000 },
          isAnonymous: { type: "boolean" },
          name: { type: "string", maxLength: 120 },
          title: { type: "string", minLength: 1, maxLength: 100 },
          urgency: { type: "string", enum: urgencyValues },
        },
      },
      ComplaintResponse: {
        type: "object",
        required: ["data"],
        properties: {
          data: {
            type: "object",
            required: ["createdAt", "status", "trackingCode"],
            properties: {
              createdAt: { type: "string", format: "date-time" },
              status: { type: "string", const: "RECEIVED" },
              trackingCode: { type: "string", minLength: 8, maxLength: 64 },
            },
          },
        },
      },
      ApiError: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "object",
            required: ["code", "message"],
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              fields: {
                type: "object",
                additionalProperties: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
