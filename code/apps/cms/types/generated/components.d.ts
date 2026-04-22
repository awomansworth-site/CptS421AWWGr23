import type { Schema, Struct } from '@strapi/strapi';

export interface AProductListingBlock extends Struct.ComponentSchema {
  collectionName: 'components_a_product_listing_blocks';
  info: {
    displayName: 'Product listing block';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'a.product-listing-block': AProductListingBlock;
    }
  }
}
