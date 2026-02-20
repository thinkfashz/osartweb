import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_WISHLIST = gql`
  query GetWishlist {
    wishlist {
      id
      productId
      product {
        id
        name
        price
        image_url
        slug
      }
    }
  }
`;

const TOGGLE_WISHLIST = gql`
  mutation ToggleWishlist($input: ToggleWishlistInput!) {
    toggleWishlist(input: $input) {
      id
      productId
    }
  }
`;

export const useWishlist = () => {
  const { data, loading, error, refetch } = useQuery<any>(GET_WISHLIST);
  return { wishlist: data?.wishlist || [], loading, error, refetch };
};

export const useToggleWishlist = () => {
  return useMutation(TOGGLE_WISHLIST, {
    refetchQueries: [{ query: GET_WISHLIST }],
  });
};
