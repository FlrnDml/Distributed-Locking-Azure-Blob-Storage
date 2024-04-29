import { config } from "dotenv";

export function loadEnvironment() {
    // Setup Dotenv to get environment from ".env" file
    config();

    // Ensure the environment variables are set
    // Azure storage account connection string, can be found in the Azure portal
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

    // Use an existing container of the storage account
    const BLOB_STORAGE_CONTAINER_NAME = process.env.BLOB_STORAGE_CONTAINER_NAME;

    if (!AZURE_STORAGE_CONNECTION_STRING) {
        throw new Error("Azure Storage Connection string is not defined in the environment variables.");
    }
    if (!BLOB_STORAGE_CONTAINER_NAME) {
        throw new Error("Blob Storage Container name is not defined in the environment variables.");
    }

    // Return the environment variables
    return {
        AZURE_STORAGE_CONNECTION_STRING,
        BLOB_STORAGE_CONTAINER_NAME
    };
}

export default loadEnvironment;