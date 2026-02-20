import { gql } from '@apollo/client';

export const GET_PRODUCT_BY_SLUG = gql`
  query ProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      id
      name
      slug
      description
      price
      compareAtPrice
      stock
      sku
      brand
      model
      isActive
      images {
        id
        url
        position
      }
      variants {
        id
        name
        value
        price
        stock
      }
      specs
    }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductsFilterInput) {
    products(filter: $filter) {
      id
      name
      slug
      price
      compareAtPrice
      stock
      brand
      model
      sku
      images {
        url
      }
    }
  }
`;
