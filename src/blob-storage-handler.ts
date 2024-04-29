import { BlobServiceClient, ContainerClient } from "@azure/storage-blob";

/**
 * Abstraction for handling blob storage operations
 * Used by DistributedLock
 */
export class BlobStorageHandler {
  private containerClient: ContainerClient;

  constructor(connectionString: string, containerName: string) {
    const blobServiceClient =
      BlobServiceClient.fromConnectionString(connectionString);
    this.containerClient = blobServiceClient.getContainerClient(containerName);
  }

  async leaseBlob(
    blobName: string,
    leaseDuration: number
  ): Promise<string | undefined> {
    try {
      console.log(await this.createBlobForLease(blobName));
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const blobs = this.containerClient.listBlobsFlat();
      for await (const blob of blobs) {
        console.log(`\tBlob Name: ${blob.name}`);
      }
      console.log(blobs);
      const leaseClient = blockBlobClient.getBlobLeaseClient();
      const lease = await leaseClient.acquireLease(leaseDuration);
      return lease.leaseId;
    } catch (error: any) {
      console.error("Failed to acquire lock: ", error.message, error.stack);
      return undefined;
    }
  }

  async releaseBlob(blobName: string, leaseId: string): Promise<void> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);

      const leaseClient = blockBlobClient.getBlobLeaseClient(leaseId);
      await leaseClient.releaseLease();
    } catch (error: any) {
      console.error("Failed to release lock: ", error.message, error.stack);
    }
  }

  /**
   * This method creates a blob in the container that can be used for leasing
   * It is an empty blob, that uses no space
   * @param blobName The name of the blob to creates
   */
  async createBlobForLease(
    blobName: string,
    content: string = ""
  ): Promise<void> {
    if (!(await this.isValidBlobName(blobName))) {
      throw new Error("Blob name is invalid");
    }
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.upload(content, content.length);
  }

  /**
   * Checks if a blob name is valid based on
   * https://learn.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata
   *
   * @returns A  blob name that can be used for leasing
   */
  async isValidBlobName(
    blobName: string,
    hierarchicalNamespaceEnabled: boolean = false
  ): Promise<boolean> {
    // Check if blob name is at least one character long and not more than 1,024 characters long
    if (blobName.length < 1 || blobName.length > 1024) {
      return false;
    }

    // Check for reserved URL characters
    const reservedCharacters = [
      "<",
      ">",
      ":",
      '"',
      "/",
      "\\",
      "|",
      "?",
      "*",
      "&",
      "%",
      "$",
      "#",
      "@",
      "!",
      "'",
      "`",
      "{",
      "}",
      "[",
      "]",
      "^",
    ];
    if (reservedCharacters.some((char) => blobName.includes(char))) {
      return false;
    }

    // Check for trailing dots, forward slashes, and backslashes
    if (
      blobName.endsWith(".") ||
      blobName.endsWith("/") ||
      blobName.endsWith("\\")
    ) {
      return false;
    }

    // Check path segment limitations based on hierarchical namespace
    const delimiter = "/";
    const maxPathSegments = hierarchicalNamespaceEnabled ? 63 : 254;
    const pathSegments = blobName.split(delimiter);
    if (pathSegments.length > maxPathSegments) {
      return false;
    }

    return true;
  }

  async deleteBlob(blobName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  }
}

export default BlobStorageHandler;
