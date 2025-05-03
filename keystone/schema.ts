import { list } from '@keystone-6/core';
import { text, relationship, select, integer, checkbox } from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

export const lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      password: text({
        validation: { isRequired: true },
      }),
      isAdmin: checkbox({
        defaultValue: false,
      }),
    },
  }),

  FeatureCategory: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      slug: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      description: text({ ui: { displayMode: 'textarea' } }),
      features: relationship({ ref: 'Feature.category', many: true }),
    },
  }),

  Feature: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      slug: text({ 
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      icon: text({ 
        label: 'Icon (path to SVG)',
      }),
      shortDescription: text({ 
        ui: { displayMode: 'textarea' } 
      }),
      description: document({
        formatting: true,
        links: true,
        dividers: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      image: text({ 
        label: 'Image Path',
      }),
      category: relationship({
        ref: 'FeatureCategory.features',
      }),
      order: integer({
        defaultValue: 0,
      }),
      highlights: relationship({
        ref: 'FeatureHighlight.feature',
        many: true,
      }),
    },
  }),

  FeatureHighlight: list({
    fields: {
      title: text({ validation: { isRequired: true } }),
      description: text({ ui: { displayMode: 'textarea' } }),
      icon: text({ 
        label: 'Icon (path to SVG or icon name)',
      }),
      iconBgColor: text({ 
        label: 'Icon Background Color (hex or CSS color)',
        defaultValue: '#f0f7ff'
      }),
      iconColor: text({ 
        label: 'Icon Color (hex or CSS color)',
        defaultValue: '#4a8cff'
      }),
      feature: relationship({
        ref: 'Feature.highlights',
      }),
    },
  }),

  Testimonial: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      role: text(),
      quote: text({ 
        validation: { isRequired: true }, 
        ui: { displayMode: 'textarea' } 
      }),
      avatar: text({ 
        label: 'Avatar Image Path',
      }),
      featured: checkbox({
        defaultValue: false,
      }),
    },
  }),
};