# Qdrant Vector Database Setup

Hướng dẫn chi tiết về việc setup và sử dụng Qdrant cho vector search trong Chat Widget Q&A.

## 🎯 Tổng quan

Qdrant là một vector database hiệu suất cao, được thiết kế đặc biệt cho các ứng dụng AI/ML. Nó cung cấp khả năng tìm kiếm vector nhanh chóng và chính xác.

## 🚀 Setup Qdrant

### 1. Tạo Qdrant Cluster

#### Sử dụng Qdrant Cloud
```bash
# 1. Đăng ký tài khoản tại https://cloud.qdrant.io/
# 2. Tạo cluster mới
# 3. Lấy API key và cluster URL
```

#### Sử dụng Docker (Local Development)
```bash
# Chạy Qdrant local
docker run -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant:latest
```

### 2. Environment Variables

#### Server (.env)
```env
# Qdrant Configuration
VECTOR_DB_TYPE=qdrant
QDRANT_URL=https://your-cluster-id.qdrant.tech
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=token-knowledge-base
QDRANT_VECTOR_SIZE=3072
QDRANT_DISTANCE_METRIC=Cosine
```

### 3. Install Dependencies

#### Package Installation
```bash
# Install Qdrant client
pnpm add @qdrant/js-client-rest

# Install types
pnpm add -D @types/qdrant
```

## 🔧 Implementation

### 1. Qdrant Service

#### Core Service Implementation
```typescript
import { QdrantClient } from '@qdrant/js-client-rest'

@Injectable()
export class QdrantService {
  private readonly client: QdrantClient
  private readonly collectionName: string
  private readonly vectorSize: number

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    })
    
    this.collectionName = process.env.QDRANT_COLLECTION_NAME
    this.vectorSize = parseInt(process.env.QDRANT_VECTOR_SIZE) || 3072
  }

  async initializeCollection(): Promise<void> {
    try {
      // Check if collection exists
      const collections = await this.client.getCollections()
      const exists = collections.collections.some(
        col => col.name === this.collectionName
      )

      if (!exists) {
        await this.createCollection()
      }

      console.log(`[✅] [QdrantService] [initializeCollection] [name]:`, this.collectionName)
    } catch (error) {
      console.error(`[🔴] [QdrantService] [initializeCollection] [error]:`, error)
      throw error
    }
  }

  async createCollection(): Promise<void> {
    try {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: this.vectorSize,
          distance: process.env.QDRANT_DISTANCE_METRIC || 'Cosine'
        },
        optimizers_config: {
          default_segment_number: 2
        },
        replication_factor: 1
      })

      console.log(`[✅] [QdrantService] [createCollection] [name]:`, this.collectionName)
    } catch (error) {
      console.error(`[🔴] [QdrantService] [createCollection] [error]:`, error)
      throw error
    }
  }
}
```

### 2. Vector Operations

#### Upsert Vectors
```typescript
async upsertVectors(
  vectors: Vector[],
  batchSize: number = 100
): Promise<void> {
  try {
    // Process in batches to avoid memory issues
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize)
      
      const points = batch.map(vector => ({
        id: vector.id,
        vector: vector.values,
        payload: {
          content: vector.metadata.content,
          source: vector.metadata.source,
          tokenSlug: vector.metadata.tokenSlug,
          type: vector.metadata.type,
          url: vector.metadata.url,
          timestamp: new Date().toISOString()
        }
      }))

      await this.client.upsert(this.collectionName, {
        wait: true,
        points
      })

      console.log(`[✅] [QdrantService] [upsertVectors] [batch ${i}-${i + batch.length}]:`, batch.length)
    }
  } catch (error) {
    console.error(`[🔴] [QdrantService] [upsertVectors] [error]:`, error)
    throw error
  }
}
```

#### Search Vectors
```typescript
async searchVectors(
  queryVector: number[],
  tokenSlug: string,
  topK: number = 5,
  scoreThreshold: number = 0.7
): Promise<SearchResult[]> {
  try {
    const response = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit: topK,
      with_payload: true,
      with_vector: false,
      score_threshold: scoreThreshold,
      filter: {
        must: [
          {
            key: 'tokenSlug',
            match: { value: tokenSlug }
          }
        ]
      }
    })

    return response.map(result => ({
      id: result.id,
      score: result.score,
      content: result.payload.content,
      source: result.payload.source,
      url: result.payload.url,
      tokenSlug: result.payload.tokenSlug,
      type: result.payload.type
    }))
  } catch (error) {
    console.error(`[🔴] [QdrantService] [searchVectors] [error]:`, error)
    throw error
  }
}
```

### 3. Advanced Filtering

#### Complex Filter Queries
```typescript
async searchWithFilters(
  queryVector: number[],
  filters: {
    tokenSlug?: string
    source?: string
    type?: string
    dateRange?: { from: Date; to: Date }
  },
  topK: number = 5
): Promise<SearchResult[]> {
  try {
    const filterConditions: any[] = []

    // Token slug filter
    if (filters.tokenSlug) {
      filterConditions.push({
        key: 'tokenSlug',
        match: { value: filters.tokenSlug }
      })
    }

    // Source filter
    if (filters.source) {
      filterConditions.push({
        key: 'source',
        match: { value: filters.source }
      })
    }

    // Type filter
    if (filters.type) {
      filterConditions.push({
        key: 'type',
        match: { value: filters.type }
      })
    }

    // Date range filter
    if (filters.dateRange) {
      filterConditions.push({
        key: 'timestamp',
        range: {
          gte: filters.dateRange.from.toISOString(),
          lte: filters.dateRange.to.toISOString()
        }
      })
    }

    const response = await this.client.search(this.collectionName, {
      vector: queryVector,
      limit: topK,
      with_payload: true,
      with_vector: false,
      filter: {
        must: filterConditions
      }
    })

    return response.map(result => ({
      id: result.id,
      score: result.score,
      content: result.payload.content,
      source: result.payload.source,
      url: result.payload.url,
      tokenSlug: result.payload.tokenSlug,
      type: result.payload.type
    }))
  } catch (error) {
    console.error(`[🔴] [QdrantService] [searchWithFilters] [error]:`, error)
    throw error
  }
}
```

## 📊 Performance Optimization

### 1. Collection Configuration

#### Optimized Collection Setup
```typescript
async createOptimizedCollection(): Promise<void> {
  try {
    await this.client.createCollection(this.collectionName, {
      vectors: {
        size: this.vectorSize,
        distance: 'Cosine'
      },
      optimizers_config: {
        default_segment_number: 4,
        max_segment_size: 200000,
        memmap_threshold: 50000,
        indexing_threshold: 20000
      },
      replication_factor: 1,
      write_consistency_factor: 1
    })

    // Create payload index for faster filtering
    await this.client.createPayloadIndex(this.collectionName, {
      field_name: 'tokenSlug',
      field_schema: 'keyword'
    })

    await this.client.createPayloadIndex(this.collectionName, {
      field_name: 'source',
      field_schema: 'keyword'
    })

    console.log(`[✅] [QdrantService] [createOptimizedCollection] [optimized]`)
  } catch (error) {
    console.error(`[🔴] [QdrantService] [createOptimizedCollection] [error]:`, error)
    throw error
  }
}
```

### 2. Batch Processing

#### Efficient Batch Operations
```typescript
async batchUpsertVectors(
  vectors: Vector[],
  batchSize: number = 100,
  parallelBatches: number = 3
): Promise<void> {
  try {
    const batches = this.chunkArray(vectors, batchSize)
    
    // Process batches in parallel
    const promises = batches.map((batch, index) => 
      this.processBatch(batch, index)
    )

    await Promise.all(promises)
    
    console.log(`[✅] [QdrantService] [batchUpsertVectors] [total]:`, vectors.length)
  } catch (error) {
    console.error(`[🔴] [QdrantService] [batchUpsertVectors] [error]:`, error)
    throw error
  }
}

private async processBatch(batch: Vector[], index: number): Promise<void> {
  const points = batch.map(vector => ({
    id: vector.id,
    vector: vector.values,
    payload: vector.metadata
  }))

  await this.client.upsert(this.collectionName, {
    wait: true,
    points
  })

  console.log(`[✅] [QdrantService] [processBatch] [batch ${index}]:`, batch.length)
}

private chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}
```

## 🔍 Monitoring & Analytics

### 1. Collection Statistics

#### Get Collection Info
```typescript
async getCollectionStats(): Promise<CollectionStats> {
  try {
    const info = await this.client.getCollection(this.collectionName)
    
    return {
      name: info.config.params.vectors.size,
      vectorCount: info.vectors_count,
      indexedVectorCount: info.indexed_vectors_count,
      pointsCount: info.points_count,
      segmentsCount: info.segments_count,
      diskDataSize: info.disk_data_size,
      ramDataSize: info.ram_data_size
    }
  } catch (error) {
    console.error(`[🔴] [QdrantService] [getCollectionStats] [error]:`, error)
    throw error
  }
}
```

### 2. Health Monitoring

#### Health Check
```typescript
async healthCheck(): Promise<HealthStatus> {
  try {
    const collections = await this.client.getCollections()
    const collectionExists = collections.collections.some(
      col => col.name === this.collectionName
    )

    return {
      status: 'healthy',
      collectionExists,
      totalCollections: collections.collections.length,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error(`[🔴] [QdrantService] [healthCheck] [error]:`, error)
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}
```

## 🛠️ Maintenance

### 1. Data Cleanup

#### Delete Old Data
```typescript
async cleanupOldData(daysOld: number = 30): Promise<void> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    await this.client.delete(this.collectionName, {
      wait: true,
      filter: {
        must: [
          {
            key: 'timestamp',
            range: {
              lt: cutoffDate.toISOString()
            }
          }
        ]
      }
    })

    console.log(`[✅] [QdrantService] [cleanupOldData] [daysOld]:`, daysOld)
  } catch (error) {
    console.error(`[🔴] [QdrantService] [cleanupOldData] [error]:`, error)
    throw error
  }
}
```

### 2. Collection Optimization

#### Optimize Collection
```typescript
async optimizeCollection(): Promise<void> {
  try {
    await this.client.updateCollection(this.collectionName, {
      optimizers_config: {
        default_segment_number: 4,
        max_segment_size: 200000,
        memmap_threshold: 50000,
        indexing_threshold: 20000
      }
    })

    console.log(`[✅] [QdrantService] [optimizeCollection] [optimized]`)
  } catch (error) {
    console.error(`[🔴] [QdrantService] [optimizeCollection] [error]:`, error)
    throw error
  }
}
```

## 🎯 Best Practices

### 1. Performance Tips
- Sử dụng batch operations cho large datasets
- Tạo payload indexes cho fields thường filter
- Monitor collection statistics thường xuyên
- Cleanup old data định kỳ

### 2. Security
- Sử dụng API key authentication
- Enable HTTPS cho production
- Monitor access logs
- Implement rate limiting

### 3. Monitoring
- Track collection size và performance
- Monitor search latency
- Alert on errors
- Regular health checks

---

**Qdrant Team** - Agent PRTGE

*Last updated: [Current Date]*
