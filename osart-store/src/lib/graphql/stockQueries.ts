import { gql } from '@apollo/client';

export const ADMIN_PRODUCTS = gql`
    query AdminProducts {
        productsConnection(first: 100) {
            edges {
                node {
                    id
                    name
                    sku
                    stock
                    image_url
                    outOfStock
                    isLowStock
                    category {
                        name
                    }
                }
            }
        }
    }
`;

export const UPDATE_STOCK = gql`
    mutation AdminUpdateStock($input: UpdateStockInput!) {
        adminUpdateStock(input: $input) {
            id
            stock
        }
    }
`;

export const STOCK_MOVEMENTS = gql`
    query AdminStockMovements($filter: StockMovementFilterInput) {
        adminStockMovements(filter: $filter) {
            id
            type
            qty
            reason
            createdAt
        }
    }
`;

export const CREATE_PRODUCT = gql`
    mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
            id
            name
            sku
            price
            stock
        }
    }
`;

export const STOCK_UPDATED = gql`
    subscription OnStockUpdated($productIds: [String!]) {
        stockUpdated(productIds: $productIds) {
            productId
            stock
            updatedAt
        }
    }
`;
