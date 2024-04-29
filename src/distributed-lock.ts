import BlobStorageHandler from "./blob-storage-handler";

export class DistributedLock {
  private blobStorageHandler: BlobStorageHandler;
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

  // async findLock(name: string): Promise<string | undefined> {
  //     try {
  //         const blobClient = this.containerClient.getBlobClient(this.blobName);
  //         const leaseClient = new BlobLeaseClient(blobClient, undefined);
  //         const lease = await leaseClient.getLease();
  //         return lease.leaseId;
  //     } catch (error: any) {
  //         console.error("Failed to find lock: ", error.message);
  //         return undefined;
  //     }
  // }

  async releaseLock(name: string): Promise<void> {
    const leaseId = this.leaseIdBlobNameMap.get(name);
    if (!leaseId) {
      throw new Error("Failed to release lock: leaseId not found");
    }
    await this.blobStorageHandler.releaseBlob(name, leaseId);
    this.leaseIdBlobNameMap.delete(name);
  }
}
