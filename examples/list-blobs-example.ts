import { BlobServiceClient } from "@azure/storage-blob";
import { loadEnvironment } from "./helper/load-environment";

const { AZURE_STORAGE_CONNECTION_STRING, BLOB_STORAGE_CONTAINER_NAME } =
  loadEnvironment();

async function main() {
  // Create a BlobServiceClient object which will be used to create a Container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  // Get a container
  const containerClient = blobServiceClient.getContainerClient(
    BLOB_STORAGE_CONTAINER_NAME
  );

  // List all blobs in the container
  console.log(`Listing blobs in container: ${BLOB_STORAGE_CONTAINER_NAME}`);

  for await (const blob of containerClient.listBlobsFlat()) {
    console.log(`\tBlob Name: ${blob.name}`);
  }
}

main().catch((err) => {
  console.error("An Error occured:", err.message);
});
