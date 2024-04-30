# Distributed-Locking-Azure-Blob-Storage
POC for a distributed locking mechanism using Azure Blob Storage

# Technology used
Our distributed locking mechanism utilizes the leasing functionality provided by Azure Blob Storage. This allows users to acquire and release locks on either an individual blob or an entire container within an Azure Storage Account.

## Understanding Leasing
Leasing is a form of lock that helps manage access to the blob or container resources. When a lease is acquired on a blob, it ensures exclusive access to that resource until the lease is released. This is crucial in preventing conflicts in distributed environments where multiple processes or users may attempt to access the same resources simultaneously.

For more detailed information on leasing, you can visit the [official Azure documentation on blob leasing](https://learn.microsoft.com/de-de/rest/api/storageservices/lease-blob?tabs=microsoft-entra-id).

## Implementation Details
The integration with Azure Blob Storage leasing is handled through our software's Azure API interactions. The relevant code is located in the /src folder, which contains scripts that connect to an Azure Storage Account and its containers.

**Here's how the process works:**

1. Connect to a Container: The mechanism initially connects to a specified container in your Azure Storage Account.
1. Blob Creation: Inside the container, the mechanism generates a blob (*a file within the container*), which is then targeted for leasing.
1. Lease Management: The blob is leased, granting exclusive access to it. This lease acts as the lock, ensuring that no other processes can modify the blob during the lease period.
1. Release and Clean-up: When the lock (*lease*) is no longer needed, it is released, and the blob is deleted, cleaning up the resources and ending the lock period.

# Decisions made
TBD

# Important Information
TBD

# Pricing
The cost estimation for using our distributed locking mechanism with Azure Blob Storage is based on two different types of pricing:

## Pricing Breakdown
**All Other Operations**: This category covers most operations except deletion, which is free. The cost is $0.005 per 10,000 operations in the hot tier. Since each lock operation requires two such operations, this leads to a cost of $0.01 per 10,000 lock operations.
**Write Operations**: These are charged at $0.065 per 10,000 operations in the hot tier. Each lock involves one write operation, totaling $0.065 per 10,000 lock operations.
Total Cost
Combining both types of operations, the total estimated cost for 10,000 lock operations is $0.075.

## Additional Considerations
Note: The blobs used for locking are 0 bytes in size, which theoretically incurs no data storage cost. However, practical billing might differ based on Azure's pricing policies and minimum storage charges.

For a detailed breakdown of Azure Blob Storage pricing, please consult the [official Azure Blob Storage Pricing Page](`https://azure.microsoft.com/en-us/pricing/details/storage/blobs/`).