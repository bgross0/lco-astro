import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Using local test credentials for now - replace with real Tina Cloud values later
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "homepage_hero",
        label: "🏠 Homepage - Hero",
        path: "src/content/homepage",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "hero",
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                required: true,
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "cta",
                label: "Call to Action",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Button Text",
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Button Link",
                  },
                ],
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
              },
            ],
          },
        ],
      },
      {
        name: "homepage_content",
        label: "🏠 Homepage - Content",
        path: "src/content/homepage",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "content",
        },
        fields: [
          {
            type: "object",
            name: "about",
            label: "About Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "image",
                label: "Image",
              },
              {
                type: "string",
                name: "imageAlt",
                label: "Image Alt Text",
              },
            ],
          },
          {
            type: "object",
            name: "equipment",
            label: "Equipment Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "cta",
            label: "CTA Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "description",
                label: "Description",
              },
              {
                type: "string",
                name: "buttonText",
                label: "Button Text",
              },
              {
                type: "string",
                name: "buttonLink",
                label: "Button Link",
              },
            ],
          },
          {
            type: "object",
            name: "reviews",
            label: "Reviews Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Subtitle",
              },
            ],
          },
        ],
      },
      {
        name: "homepage_services",
        label: "🏠 Homepage - Services Showcase",
        path: "src/content/homepage",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "services-showcase",
        },
        fields: [
          {
            type: "string",
            name: "title",
            label: "Section Title",
          },
          {
            type: "string",
            name: "subtitle",
            label: "Section Subtitle",
          },
          {
            type: "object",
            name: "services",
            label: "Services",
            list: true,
            fields: [
              {
                type: "string",
                name: "title",
                label: "Service Title",
              },
              {
                type: "string",
                name: "description",
                label: "Service Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "image",
                label: "Service Image",
              },
              {
                type: "string",
                name: "link",
                label: "Service Link",
              },
            ],
          },
        ],
      },
      {
        name: "services",
        label: "⚙️ Services",
        path: "src/content/services",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
          },
          {
            type: "string",
            name: "heroAlt",
            label: "Hero Image Alt Text",
          },
          {
            type: "number",
            name: "order",
            label: "Display Order",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "blog",
        label: "📝 Blog Posts",
        path: "src/content/blog",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Description",
            required: true,
          },
          {
            type: "datetime",
            name: "pubDate",
            label: "Publication Date",
            required: true,
          },
          {
            type: "string",
            name: "author",
            label: "Author",
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image",
          },
          {
            type: "string",
            name: "heroAlt",
            label: "Hero Image Alt Text",
          },
          {
            type: "string",
            name: "tags",
            label: "Tags",
            list: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        name: "testimonials",
        label: "💬 Testimonials",
        path: "src/content/testimonials",
        format: "md",
        fields: [
          {
            type: "string",
            name: "name",
            label: "Client Name",
            required: true,
          },
          {
            type: "string",
            name: "company",
            label: "Company/Organization",
          },
          {
            type: "string",
            name: "service",
            label: "Service Used",
          },
          {
            type: "number",
            name: "rating",
            label: "Rating (1-5)",
          },
          {
            type: "datetime",
            name: "date",
            label: "Testimonial Date",
          },
          {
            type: "boolean",
            name: "featured",
            label: "Featured",
          },
          {
            type: "rich-text",
            name: "body",
            label: "Testimonial",
            isBody: true,
          },
        ],
      },
      {
        name: "pages",
        label: "📄 Pages",
        path: "src/content/pages",
        format: "json",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Page Title",
            required: true,
          },
          {
            type: "string",
            name: "description",
            label: "Meta Description",
          },
          {
            type: "string",
            name: "slug",
            label: "URL Slug",
            required: true,
          },
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Hero Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Hero Subtitle",
              },
              {
                type: "image",
                name: "image",
                label: "Hero Image",
              },
            ],
          },
          {
            type: "object",
            name: "sections",
            label: "Page Sections",
            list: true,
            fields: [
              {
                type: "string",
                name: "type",
                label: "Section Type",
                options: ["content", "gallery", "cta", "contact"],
              },
              {
                type: "string",
                name: "title",
                label: "Section Title",
              },
              {
                type: "string",
                name: "content",
                label: "Section Content",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
        ],
      },
      {
        name: "settings",
        label: "⚙️ Settings",
        path: "src/data",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "settings",
        },
        fields: [
          {
            type: "object",
            name: "site",
            label: "Site Information",
            fields: [
              {
                type: "string",
                name: "name",
                label: "Site Name",
              },
              {
                type: "string",
                name: "description",
                label: "Site Description",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "url",
                label: "Site URL",
              },
            ],
          },
          {
            type: "object",
            name: "contact",
            label: "Contact Information",
            fields: [
              {
                type: "string",
                name: "phone",
                label: "Phone Number",
              },
              {
                type: "string",
                name: "email",
                label: "Email Address",
              },
              {
                type: "string",
                name: "address",
                label: "Physical Address",
                ui: {
                  component: "textarea",
                },
              },
            ],
          },
          {
            type: "object",
            name: "business",
            label: "Business Information",
            fields: [
              {
                type: "string",
                name: "hours",
                label: "Business Hours",
              },
              {
                type: "string",
                name: "serviceArea",
                label: "Service Area",
              },
            ],
          },
        ],
      },
    ],
  },
});
