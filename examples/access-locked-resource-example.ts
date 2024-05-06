import { DistributedLock } from "../src/distributed-lock";
import loadEnvironment from "./helper/load-environment";

const { AZURE_STORAGE_CONNECTION_STRING, BLOB_STORAGE_CONTAINER_NAME } =
  loadEnvironment();


// run multiple operations with locks for the same resource

const resource = "resource-1";

runOperationWithLock(resource, 1);
runOperationWithLock(resource, 2);
runOperationWithLock(resource, 3);


// run a single operation with a lock for a resource
async function runOperationWithLock(name: string, id: number) {
  try {
    const lock = new DistributedLock(
      AZURE_STORAGE_CONNECTION_STRING,
      BLOB_STORAGE_CONTAINER_NAME
    );

    await lock.acquireLock(name);
    console.log(id, "Lock acquired...");

    // Simulate an operation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(id, "Operation processed");

    await lock.releaseLock(name);
    console.log(id, "Lock released");
  } catch (err: any) {
    console.error(id, "Lock failed");
  }
}
