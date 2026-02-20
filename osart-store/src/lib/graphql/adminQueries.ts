import { gql } from '@apollo/client';

export const ADMIN_SALES_SUMMARY = gql`
    query AdminSalesSummary($dateRange: String) {
        adminSalesSummary(dateRange: $dateRange) {
            totalRevenue
            totalOrders
            avgOrderValue
            revenueByDay {
                date
                revenue
                orders
            }
            topProducts {
                productId
                name
                unitsSold
                revenue
            }
        }
    }
`;

export const ADMIN_ORDERS = gql`
    query AdminOrders($filter: JSONObject) {
        adminOrders(filter: $filter)
    }
`;

export const ADMIN_SEED_DATA = gql`
    mutation AdminSeedDemoData {
        adminSeedDemoData
    }
`;

// Added standard filter options
export const ADMIN_CUSTOMERS = gql`
    query AdminCustomers($search: String) {
        adminCustomers(search: $search) {
            id
            fullName
            email
            phone
            totalOrders
            totalSpent
            createdAt
        }
    }
`;

export const ADMIN_DATABASE_STATUS = gql`
    query AdminDatabaseStatus {
        adminDatabaseStatus {
            connected
            databaseUrl
            version
            tables {
                name
                rowCount
                lastUpdate
            }
        }
    }
`;

export const ADMIN_CUSTOMER_DETAIL = gql`
    query AdminCustomerDetail($id: ID!) {
        adminCustomerDetail(id: $id)
    }
`;
