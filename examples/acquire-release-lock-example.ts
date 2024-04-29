import { DistributedLock } from "../src/distributed-lock";
import loadEnvironment from "./helper/load-environment";

const { AZURE_STORAGE_CONNECTION_STRING, BLOB_STORAGE_CONTAINER_NAME } =
  loadEnvironment();

async function runOperationWithLock(blobName: string = "resource-1") {

  // use the DistributedLock class to acquire and release a lock
  const lock = new DistributedLock(
    AZURE_STORAGE_CONNECTION_STRING,
    BLOB_STORAGE_CONTAINER_NAME
  );

  await lock.acquireLock(blobName);
  console.log("Lock acquired...");

  // Simulate a operation
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("Operation processed");

  await lock.releaseLock(blobName);
  console.log("Lock released");
}

runOperationWithLock().catch((err) => {
  console.error("An Error occured:", err.message);
});
