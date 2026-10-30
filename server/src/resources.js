/**
 * One definition per editable table.
 * - The API only reads/writes the columns listed here (SQL-injection safe whitelist).
 * - The admin panel builds its lists and forms from this same definition.
 *
 * Field types: text | textarea | number | date | url | email | image | boolean | select | province
 */
const resources = {
  news: {
    label: 'News & events',
    group: 'News',
    orderBy: 'COALESCE(published_at, created_at) DESC, id DESC',
    fields: [
      { name: 'title', label: 'Headline', type: 'text', required: true, list: true },
      { name: 'slug', label: 'Web address name (leave blank to create from headline)', type: 'text' },
      { name: 'summary', label: 'Short summary (shown on cards)', type: 'textarea', required: true },
      { name: 'body', label: 'Full story', type: 'textarea', rows: 12 },
      { name: 'image_url', label: 'Photo', type: 'image' },
      { name: 'image_alt', label: 'Describe the photo (for screen readers)', type: 'text' },
      { name: 'published_at', label: 'Date', type: 'date', list: true },
      { name: 'is_published', label: 'Show on website', type: 'boolean', list: true, default: 1 },
    ],
  },
  congregations: {
    label: 'Congregations',
    group: 'The Church',
    orderBy: 'name ASC',
    fields: [
      { name: 'name', label: 'Congregation', type: 'text', required: true, list: true },
      { name: 'province_id', label: 'Province', type: 'province', required: true, list: true },
      { name: 'town', label: 'Town / village', type: 'text', list: true },
      { name: 'contact_person', label: 'Contact person', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'service_time', label: 'Sunday service time', type: 'text' },
    ],
  },
  leaders: {
    label: 'Leadership',
    group: 'The Church',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'full_name', label: 'Full name', type: 'text', list: true },
      { name: 'title', label: 'Title', type: 'text', required: true, list: true },
      { name: 'photo_url', label: 'Photo', type: 'image' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  church_values: {
    label: 'Values',
    group: 'The Church',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'title', label: 'Value', type: 'text', required: true, list: true },
      { name: 'description', label: 'Description', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  stats: {
    label: 'Numbers at a glance',
    group: 'Home page',
    orderBy: "FIELD(section,'home','education','health'), sort_order",
    fields: [
      {
        name: 'section', label: 'Page section', type: 'select', required: true, list: true,
        options: [
          { value: 'home', label: 'Home: CBC PNG at a glance' },
          { value: 'education', label: 'Education' },
          { value: 'health', label: 'Health' },
        ],
      },
      { name: 'value', label: 'Number (e.g. 120 or 15,000)', type: 'text', list: true },
      { name: 'label', label: 'Label', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  ministries: {
    label: 'Ministry tiles',
    group: 'Home page',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, list: true },
      { name: 'summary', label: 'Summary', type: 'text', required: true, list: true },
      { name: 'link', label: 'Link (e.g. /about#youth)', type: 'text', required: true },
      { name: 'image_url', label: 'Photo', type: 'image' },
      { name: 'image_alt', label: 'Describe the photo', type: 'text' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  youth_activities: {
    label: 'Youth: what we do',
    group: 'Youth',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'title', label: 'Activity', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  events: {
    label: 'Upcoming events',
    group: 'Youth',
    orderBy: 'event_date IS NULL, event_date ASC, id',
    fields: [
      {
        name: 'ministry', label: 'Ministry', type: 'select', required: true, list: true, default: 'youth',
        options: ['youth', 'general', 'mission', 'education', 'health'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })),
      },
      { name: 'title', label: 'Event', type: 'text', required: true, list: true },
      { name: 'event_date', label: 'Date', type: 'date', list: true },
      { name: 'date_text', label: 'Date as text (if exact date not set, e.g. "December 2026")', type: 'text' },
      { name: 'venue', label: 'Place', type: 'text', list: true },
    ],
  },
  institutions: {
    label: 'Colleges & training institutes',
    group: 'Training & Services',
    orderBy: 'category, sort_order, id',
    fields: [
      {
        name: 'category', label: 'Shown under', type: 'select', required: true, list: true,
        options: [
          { value: 'bible_college', label: 'About → Bible College & Schools' },
          { value: 'training', label: 'Training & Services → Training' },
        ],
      },
      { name: 'name', label: 'Institution', type: 'text', required: true, list: true },
      { name: 'location', label: 'Place / province', type: 'text', list: true },
      { name: 'courses', label: 'Courses offered', type: 'text' },
      { name: 'length', label: 'Length', type: 'text' },
      { name: 'intake', label: 'Intake month', type: 'text' },
      { name: 'fees', label: 'Fees (PGK)', type: 'text' },
      { name: 'contact', label: 'Contact (phone / email)', type: 'text' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  school_levels: {
    label: 'Schools by level',
    group: 'Training & Services',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'level', label: 'Level', type: 'text', required: true, list: true },
      { name: 'number_of_schools', label: 'Number of schools', type: 'number', list: true },
      { name: 'students', label: 'Students', type: 'number', list: true },
      { name: 'provinces', label: 'Provinces', type: 'text' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  education_secretaries: {
    label: 'Church Education Secretaries',
    group: 'Training & Services',
    orderBy: 'sort_order, province',
    fields: [
      { name: 'province', label: 'Province', type: 'text', required: true, list: true },
      { name: 'full_name', label: 'CES name', type: 'text', list: true },
      { name: 'office', label: 'Office location', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  health_facility_types: {
    label: 'Health facilities by type',
    group: 'Training & Services',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'facility_type', label: 'Type', type: 'text', required: true, list: true },
      { name: 'number', label: 'Number', type: 'number', list: true },
      { name: 'provinces', label: 'Provinces', type: 'text' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  health_programmes: {
    label: 'Health programmes',
    group: 'Training & Services',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'title', label: 'Programme', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  mission_partners: {
    label: 'Mission partners',
    group: 'Overseas Mission',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'name', label: 'Partner mission or church', type: 'text', required: true, list: true },
      { name: 'country', label: 'Country', type: 'text', list: true },
      { name: 'website', label: 'Website', type: 'url' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  missionaries: {
    label: 'Missionaries',
    group: 'Overseas Mission',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'full_name', label: 'Name', type: 'text', required: true, list: true },
      { name: 'country', label: 'Country', type: 'text', list: true },
      { name: 'ministry', label: 'Ministry', type: 'text' },
      { name: 'photo_url', label: 'Photo', type: 'image' },
      { name: 'public_consent', label: 'Has given permission to be shown publicly', type: 'boolean', list: true, default: 0 },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  history_events: {
    label: 'History timeline',
    group: 'History',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'year_label', label: 'Year', type: 'text', list: true },
      { name: 'description', label: 'What happened', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  gallery_images: {
    label: 'Photos',
    group: 'Photos',
    orderBy: 'section, sort_order, id',
    fields: [
      {
        name: 'section', label: 'Where it appears', type: 'select', required: true, list: true,
        options: [
          { value: 'hero', label: 'Home page main photo' },
          { value: 'youth', label: 'Youth gallery' },
          { value: 'history', label: 'History archives' },
          { value: 'cbm', label: 'CBM featured books' },
          { value: 'contact', label: 'Contact page (if no map)' },
        ],
      },
      { name: 'caption', label: 'Caption', type: 'text', required: true, list: true },
      { name: 'image_url', label: 'Photo', type: 'image' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  publications: {
    label: 'CBM: what we publish',
    group: 'Publication',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'title', label: 'Item', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  bookshops: {
    label: 'Bookshops',
    group: 'Publication',
    orderBy: 'sort_order, name',
    fields: [
      { name: 'name', label: 'Bookshop', type: 'text', required: true, list: true },
      { name: 'town', label: 'Town, province', type: 'text', list: true },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'hours', label: 'Opening hours', type: 'text' },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  partnership_ways: {
    label: 'Ways to partner',
    group: 'Giving',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'text', label: 'Way to partner', type: 'text', required: true, list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  ministry_contacts: {
    label: 'Ministry contacts',
    group: 'Contact',
    orderBy: 'sort_order, id',
    fields: [
      { name: 'ministry', label: 'Ministry', type: 'text', required: true, list: true },
      { name: 'contact', label: 'Contact (name, phone)', type: 'text', list: true },
      { name: 'sort_order', label: 'Order', type: 'number' },
    ],
  },
  provinces: {
    label: 'Provinces',
    group: 'The Church',
    orderBy: 'name',
    fields: [{ name: 'name', label: 'Province', type: 'text', required: true, list: true }],
  },
};

module.exports = resources;
