import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      items {
        id
        quantity
        unitPrice
        product {
          id
          name
          price
          stock
        }
      }
      subtotal
    }
  }
`;
