// TinaCMS configuration — the editing UI for Option 2, served at /tina-admin/.
// Reads and writes exactly the same content files as Option 1 (Sveltia).
import { defineConfig, type Template, type TinaField } from 'tinacms';

const buttonFields: TinaField[] = [
  { type: 'string', name: 'button_label', label: 'Button text' },
  { type: 'string', name: 'button_url', label: 'Button link',
    description: 'Leave blank to use the online booking link from Site Settings.' },
];

const sectionTemplates: Template[] = [
  {
    name: 'callout', label: 'Call to action',
    ui: { itemProps: (item) => ({ label: `Call to action — ${(item?.heading ?? '').split('\n')[0]}` }) },
    fields: [
      { type: 'string', name: 'heading', label: 'Heading', required: true, ui: { component: 'textarea' },
        description: 'One phrase per line. **bold** for bold, *italic* for the handwriting style.' },
      { type: 'rich-text', name: 'text', label: 'Text under heading' },
      ...buttonFields,
    ],
  },
  {
    name: 'text', label: 'Text block',
    ui: { itemProps: (item) => ({ label: 'Text block' }) },
    fields: [
      { type: 'rich-text', name: 'body', label: 'Text', required: true },
      { type: 'image', name: 'background_image', label: 'Background photo',
        description: 'Optional. Adds a wide photo behind the text (text sits on the right).' },
      { type: 'number', name: 'columns', label: 'List columns (1 or 3)' },
      ...buttonFields,
    ],
  },
  {
    name: 'two_column', label: 'Two columns',
    ui: { itemProps: () => ({ label: 'Two columns' }) },
    fields: [
      { type: 'rich-text', name: 'left', label: 'Left text' },
      { type: 'image', name: 'left_image', label: 'Left image (instead of text)' },
      { type: 'string', name: 'left_image_alt', label: 'Left image description' },
      { type: 'rich-text', name: 'right', label: 'Right text' },
      { type: 'image', name: 'right_image', label: 'Right image (instead of text)' },
      { type: 'string', name: 'right_image_alt', label: 'Right image description' },
    ],
  },
  {
    name: 'cards', label: 'Photo + text rows',
    ui: { itemProps: (item) => ({ label: `Photo + text rows (${item?.items?.length ?? 0})` }) },
    fields: [
      { type: 'object', name: 'items', label: 'Rows', list: true,
        ui: { itemProps: (item) => ({ label: item?.title }) },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true },
          { type: 'rich-text', name: 'text', label: 'Text' },
          { type: 'image', name: 'image', label: 'Photo' },
          { type: 'string', name: 'image_alt', label: 'Photo description' },
          { type: 'string', name: 'link_label', label: 'Link text' },
          { type: 'string', name: 'link_url', label: 'Link' },
        ] },
    ],
  },
  {
    name: 'faq', label: 'Questions & answers',
    ui: { itemProps: (item) => ({ label: `Questions & answers (${item?.items?.length ?? 0})` }) },
    fields: [
      { type: 'object', name: 'items', label: 'Questions', list: true,
        ui: { itemProps: (item) => ({ label: item?.question }) },
        fields: [
          { type: 'string', name: 'question', label: 'Question', required: true },
          { type: 'rich-text', name: 'answer', label: 'Answer' },
        ] },
    ],
  },
  {
    name: 'contact_info', label: 'Contact details (phone, address, hours)',
    ui: { itemProps: () => ({ label: 'Contact details (from Site Settings)' }) },
    fields: [{ type: 'boolean', name: 'enabled', label: 'Show', description: 'Phone, address and hours come from Site Settings.' }],
  },
];

const pageFields: TinaField[] = [
  { type: 'string', name: 'title', label: 'Page title (banner)', isTitle: true, required: true },
  { type: 'string', name: 'heading', label: 'Headline' },
  { type: 'rich-text', name: 'body', label: 'Intro paragraph(s)', isBody: true },
  { type: 'string', name: 'description', label: 'Search engine description' },
  { type: 'number', name: 'order', label: 'Menu order' },
  { type: 'object', name: 'sections', label: 'Page sections', list: true, templates: sectionTemplates },
];

export default defineConfig({
  branch: process.env.TINA_BRANCH || process.env.CF_PAGES_BRANCH || 'main',
  clientId: process.env.TINA_PUBLIC_CLIENT_ID || null,   // from app.tina.io (production only)
  token: process.env.TINA_TOKEN || null,                 // from app.tina.io (production only)
  build: { outputFolder: 'tina-admin', publicFolder: 'public' },
  media: { tina: { mediaRoot: 'images', publicFolder: 'public' } },
  schema: {
    collections: [
      {
        name: 'page', label: 'Pages', path: 'src/content/pages', format: 'md',
        fields: pageFields,
      },
      {
        name: 'site', label: 'Site Settings', path: 'src/content/singles', format: 'yml',
        match: { include: 'site' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'string', name: 'phone', label: 'Phone', required: true },
          { type: 'string', name: 'address', label: 'Address', ui: { component: 'textarea' }, description: 'One line per row.' },
          { type: 'string', name: 'map_url', label: 'Map link' },
          { type: 'string', name: 'booking_url', label: 'Online booking link' },
          { type: 'string', name: 'portal_url', label: 'Patient portal link' },
          { type: 'object', name: 'hours', label: 'Appointment hours', list: true,
            ui: { itemProps: (i) => ({ label: `${i?.days}: ${i?.hours}` }) },
            fields: [
              { type: 'string', name: 'days', label: 'Day(s)' },
              { type: 'string', name: 'hours', label: 'Hours' },
            ] },
          { type: 'string', name: 'hours_note', label: 'Note under hours' },
          { type: 'string', name: 'footer_blurb', label: 'Footer paragraph', ui: { component: 'textarea' } },
          { type: 'rich-text', name: 'disclaimer', label: 'Services disclaimer (footer)' },
          { type: 'object', name: 'documents', label: 'Documents (PDFs)', list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: 'string', name: 'label', label: 'Name' },
              { type: 'string', name: 'file', label: 'File path', description: 'e.g. /docs/website-privacy-policy.pdf' },
            ] },
          { type: 'object', name: 'nav', label: 'Menu', list: true,
            ui: { itemProps: (i) => ({ label: i?.label }) },
            fields: [
              { type: 'string', name: 'label', label: 'Label' },
              { type: 'string', name: 'url', label: 'Link', description: 'e.g. /about/ — leave blank for a heading with sub-items only' },
              { type: 'object', name: 'children', label: 'Sub-items', list: true,
                ui: { itemProps: (i) => ({ label: i?.label }) },
                fields: [
                  { type: 'string', name: 'label', label: 'Label' },
                  { type: 'string', name: 'url', label: 'Link' },
                ] },
            ] },
          { type: 'string', name: 'name', label: 'Site name' },
          { type: 'string', name: 'tagline', label: 'Tagline (browser tab)' },
        ],
      },
      {
        name: 'home', label: 'Home page', path: 'src/content/singles', format: 'yml',
        match: { include: 'home' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          { type: 'object', name: 'hero', label: 'Top banner', fields: [
            { type: 'string', name: 'heading', label: 'Heading' },
            { type: 'string', name: 'script_heading', label: 'Handwritten word' },
            { type: 'string', name: 'text', label: 'Text' },
            { type: 'image', name: 'image', label: 'Photo' },
            ...buttonFields,
          ] },
          { type: 'object', name: 'intro', label: 'Second section', fields: [
            { type: 'string', name: 'heading', label: 'Heading', ui: { component: 'textarea' }, description: '**bold**, *handwriting*' },
            { type: 'image', name: 'image', label: 'Photo' },
            ...buttonFields,
          ] },
          { type: 'object', name: 'services', label: 'Services section', fields: [
            { type: 'string', name: 'heading', label: 'Heading' },
            { type: 'string', name: 'script_heading', label: 'Handwritten word' },
            { type: 'image', name: 'background_image', label: 'Background photo' },
            { type: 'object', name: 'items', label: 'Service circles', list: true,
              ui: { itemProps: (i) => ({ label: i?.title }) },
              fields: [
                { type: 'string', name: 'title', label: 'Title' },
                { type: 'image', name: 'icon', label: 'Icon (shown on hover)' },
                { type: 'string', name: 'url', label: 'Link' },
              ] },
            ...buttonFields,
          ] },
          { type: 'object', name: 'callout', label: 'Bottom call to action', fields: [
            { type: 'string', name: 'heading', label: 'Heading', ui: { component: 'textarea' } },
            { type: 'rich-text', name: 'text', label: 'Text' },
            ...buttonFields,
          ] },
          { type: 'string', name: 'description', label: 'Search engine description' },
        ],
      },
    ],
  },
});
