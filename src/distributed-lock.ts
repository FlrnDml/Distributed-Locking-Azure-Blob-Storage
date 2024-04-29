import BlobStorageHandler from "./blob-storage-handler";

export class DistributedLock {
  private blobStorageHandler: BlobStorageHandler;
  /**
   * Map to store the leaseId and blobName
   * 
   * Azure Blob Storage does not provide a way to release a lock using the blob name
   * The leaseId is required to release the lock
   * We are mapping the blobName to the leaseId to make it easier to release the lock
   */
  private leaseIdBlobNameMap: Map<string, string> = new Map();

  constructor(
    connectionString: string,
    containerName: string,
  ) {
    this.blobStorageHandler = new BlobStorageHandler(
      connectionString,
      containerName
    );
  }

  async acquireLock(name: string, leaseDuration: number = 30): Promise<void> {
    const leaseId = await this.blobStorageHandler.leaseBlob(
      name,
      leaseDuration
    );
    if (!leaseId) {
      throw new Error("Failed to acquire lock");
    }
    this.leaseIdBlobNameMap.set(name, leaseId);
  }

  async releaseLock(name: string): Promise<void> {
    const leaseId = this.leaseIdBlobNameMap.get(name);
    if (!leaseId) {
      throw new Error("Failed to release lock: leaseId not found");
    }
    await this.blobStorageHandler.releaseBlob(name, leaseId);
    this.leaseIdBlobNameMap.delete(name);
  }
}
