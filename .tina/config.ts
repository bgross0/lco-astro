import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.CF_PAGES_BRANCH ||
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Tina Cloud credentials
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
            type: "string",
            name: "title",
            label: "Title",
            required: true,
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
            type: "string",
            name: "ctaText",
            label: "CTA Button Text",
          },
          {
            type: "string",
            name: "ctaLink",
            label: "CTA Button Link",
          },
          {
            type: "object",
            name: "images",
            label: "Hero Images",
            list: true,
            fields: [
              {
                type: "image",
                name: "src",
                label: "Image",
              },
              {
                type: "string",
                name: "alt",
                label: "Alt Text",
              },
            ],
          },
          {
            type: "object",
            name: "bottomServices",
            label: "Bottom Services",
            list: true,
            fields: [
              {
                type: "string",
                name: "icon",
                label: "Icon Name",
              },
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
                name: "paragraphs",
                label: "Paragraphs",
                list: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "object",
                name: "images",
                label: "Images",
                list: true,
                fields: [
                  {
                    type: "image",
                    name: "src",
                    label: "Image",
                  },
                  {
                    type: "string",
                    name: "alt",
                    label: "Alt Text",
                  },
                ],
              },
              {
                type: "object",
                name: "features",
                label: "Features",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                  },
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                  },
                ],
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
            name: "clientSatisfaction",
            label: "Client Satisfaction Section",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
              },
              {
                type: "string",
                name: "paragraphs",
                label: "Paragraphs",
                list: true,
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "experienceTitle",
                label: "Experience Title",
              },
              {
                type: "string",
                name: "experienceText",
                label: "Experience Text",
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "string",
                name: "highlight",
                label: "Highlight",
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
                type: "object",
                name: "stats",
                label: "Stats",
                list: true,
                fields: [
                  {
                    type: "number",
                    name: "number",
                    label: "Number",
                  },
                  {
                    type: "string",
                    name: "label",
                    label: "Label",
                  },
                ],
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
                ui: {
                  component: "textarea",
                },
              },
              {
                type: "image",
                name: "backgroundImage",
                label: "Background Image",
              },
              {
                type: "object",
                name: "primaryButton",
                label: "Primary Button",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Link",
                  },
                ],
              },
              {
                type: "object",
                name: "secondaryButton",
                label: "Secondary Button",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Text",
                  },
                  {
                    type: "string",
                    name: "link",
                    label: "Link",
                  },
                ],
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
              {
                type: "number",
                name: "rating",
                label: "Rating",
              },
              {
                type: "number",
                name: "reviewCount",
                label: "Review Count",
              },
              {
                type: "string",
                name: "googleBusinessUrl",
                label: "Google Business URL",
              },
              {
                type: "string",
                name: "shapoWidgetId",
                label: "Shapo Widget ID",
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
            type: "number",
            name: "autoScrollInterval",
            label: "Auto Scroll Interval (ms)",
          },
          {
            type: "object",
            name: "services",
            label: "Services",
            list: true,
            fields: [
              {
                type: "string",
                name: "id",
                label: "Service ID",
              },
              {
                type: "string",
                name: "title",
                label: "Service Title",
              },
              {
                type: "string",
                name: "subtitle",
                label: "Service Subtitle",
              },
              {
                type: "string",
                name: "icon",
                label: "Icon Name",
              },
              {
                type: "image",
                name: "image",
                label: "Service Image",
              },
              {
                type: "string",
                name: "href",
                label: "Service Link",
              },
              {
                type: "number",
                name: "order",
                label: "Display Order",
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
            name: "author",
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
            type: "string",
            name: "site_title",
            label: "Site Title",
          },
          {
            type: "string",
            name: "site_description",
            label: "Site Description",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "image",
            name: "logo",
            label: "Logo",
          },
          {
            type: "object",
            name: "social",
            label: "Social Media",
            fields: [
              {
                type: "string",
                name: "facebook",
                label: "Facebook URL",
              },
              {
                type: "string",
                name: "instagram",
                label: "Instagram URL",
              },
              {
                type: "string",
                name: "linkedin",
                label: "LinkedIn URL",
              },
            ],
          },
          {
            type: "string",
            name: "cellphone",
            label: "Office Phone",
          },
          {
            type: "string",
            name: "phone",
            label: "Field Phone",
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
          },
          {
            type: "string",
            name: "hours",
            label: "Hours Description",
          },
          {
            type: "image",
            name: "og_image",
            label: "OG Image",
          },
          {
            type: "object",
            name: "geo",
            label: "Geographic Location",
            fields: [
              {
                type: "number",
                name: "latitude",
                label: "Latitude",
              },
              {
                type: "number",
                name: "longitude",
                label: "Longitude",
              },
            ],
          },
          {
            type: "string",
            name: "priceRange",
            label: "Price Range",
          },
          {
            type: "string",
            name: "openingHours",
            label: "Opening Hours (Schema.org format)",
          },
          {
            type: "object",
            name: "businessHours",
            label: "Business Hours",
            fields: [
              {
                type: "string",
                name: "weekdays",
                label: "Weekdays",
              },
              {
                type: "string",
                name: "saturday",
                label: "Saturday",
              },
              {
                type: "string",
                name: "sunday",
                label: "Sunday",
              },
              {
                type: "string",
                name: "emergency",
                label: "Emergency Service",
              },
            ],
          },
          {
            type: "object",
            name: "analytics",
            label: "Analytics",
            fields: [
              {
                type: "string",
                name: "gtmId",
                label: "Google Tag Manager ID",
              },
              {
                type: "string",
                name: "gaId",
                label: "Google Analytics ID",
              },
              {
                type: "boolean",
                name: "enableTracking",
                label: "Enable Tracking",
              },
            ],
          },
          {
            type: "object",
            name: "abTests",
            label: "A/B Tests",
            fields: [
              {
                type: "object",
                name: "homepageCTA",
                label: "Homepage CTA Test",
                fields: [
                  {
                    type: "boolean",
                    name: "enabled",
                    label: "Enabled",
                  },
                  {
                    type: "object",
                    name: "variants",
                    label: "Variants",
                    list: true,
                    fields: [
                      {
                        type: "string",
                        name: "text",
                        label: "Text",
                      },
                      {
                        type: "string",
                        name: "trackingLabel",
                        label: "Tracking Label",
                      },
                    ],
                  },
                ],
              },
              {
                type: "object",
                name: "contactButton",
                label: "Contact Button Test",
                fields: [
                  {
                    type: "boolean",
                    name: "enabled",
                    label: "Enabled",
                  },
                  {
                    type: "object",
                    name: "variants",
                    label: "Variants",
                    list: true,
                    fields: [
                      {
                        type: "string",
                        name: "text",
                        label: "Text",
                      },
                      {
                        type: "string",
                        name: "trackingLabel",
                        label: "Tracking Label",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
