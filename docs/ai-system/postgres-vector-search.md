# PostgreSQL Vector Search System

Hướng dẫn chi tiết về việc sử dụng PostgreSQL với pgvector extension cho vector search trong Chat Widget Q&A.

## 🎯 Tổng quan

PostgreSQL Vector (pgvector) là một extension mạnh mẽ cho PostgreSQL, cho phép lưu trữ và tìm kiếm vector embeddings trực tiếp trong database. Điều này giúp đơn giản hóa kiến trúc và giảm chi phí vận hành.

## 🚀 Setup PostgreSQL Vector

### 1. Cài đặt pgvector Extension

#### PostgreSQL Setup
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify installation
SELECT * FROM pg_extension WHERE extname = 'vector';
```

#### Docker Setup
```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: pgvector/pgvector:pg15
    environment:
      POSTGRES_DB: chat_widget_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 2. Environment Variables

#### Server (.env)
```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=chat_widget_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# PostgreSQL Vector
POSTGRES_VECTOR_EXTENSION=pgvector
VECTOR_DIMENSION=3072
VECTOR_SIMILARITY_THRESHOLD=0.7
VECTOR_INDEX_LISTS=100
```

### 3. Install Dependencies

#### Package Installation
```bash
# Install pgvector types
pnpm add @types/pg

# Install additional vector utilities
pnpm add pg-vector
```

## 🔧 Implementation

### 1. Database Entity

#### Document Chunk Entity
```typescript
import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm'

@Entity('document_chunks')
@Index(['tokenSlug', 'type'])
@Index(['embedding'], { using: 'ivfflat', with: { lists: 100 } })
export class DocumentChunkEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('text')
  content: string

  @Column()
  source: string

  @Column()
  tokenSlug: string

  @Column()
  type: string

  @Column({ nullable: true })
  url?: string

  @Column('vector', { length: 3072 })
  embedding: number[]

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
```

### 2. PostgreSQL Vector Service

#### Core Service Implementation
```typescript
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { DocumentChunkEntity } from '../entities/document-chunk.entity'

@Injectable()
export class PostgresVectorService {
  constructor(
    @InjectRepository(DocumentChunkEntity)
    private readonly documentChunkRepository: Repository<DocumentChunkEntity>
  ) {}

  async initializeVectorExtension(): Promise<void> {
    try {
      await this.documentChunkRepository.query(`
        CREATE EXTENSION IF NOT EXISTS vector
      `)
      
      console.log(`[✅] [PostgresVectorService] [initializeVectorExtension] [enabled]`)
    } catch (error) {
      console.error(`[🔴] [PostgresVectorService] [initializeVectorExtension] [error]:`, error)
      throw error
    }
  }

  async createVectorIndex(): Promise<void> {
    try {
      await this.documentChunkRepository.query(`
        CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
        ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
        WITH (lists = ${process.env.VECTOR_INDEX_LISTS || 100})
      `)
      
      console.log(`[✅] [PostgresVectorService] [createVectorIndex] [created]`)
    } catch (error) {
      console.error(`[🔴] [PostgresVectorService] [createVectorIndex] [error]:`, error)
      throw error
    }
  }
}
```

### 3. Vector Operations

#### Upsert Vectors
```typescript
async upsertVectors(
  vectors: Vector[],
  tokenSlug: string
): Promise<void> {
  try {
    const chunks = vectors.map(vector => ({
      id: vector.id,
      content: vector.metadata.content,
      source: vector.metadata.source,
      tokenSlug: vector.metadata.tokenSlug,
      type: vector.metadata.type,
      url: vector.metadata.url,
      embedding: vector.values,
      metadata: vector.metadata
    }))

    await this.documentChunkRepository.upsert(chunks, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true
    })
    
    console.log(`[✅] [PostgresVectorService] [upsertVectors] [count]:`, vectors.length)
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [upsertVectors] [error]:`, error)
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
  similarityThreshold: number = 0.7
): Promise<SearchResult[]> {
  try {
    const results = await this.documentChunkRepository
      .createQueryBuilder('chunk')
      .select([
        'chunk.id',
        'chunk.content',
        'chunk.source',
        'chunk.url',
        'chunk.tokenSlug',
        'chunk.type',
        'chunk.metadata'
      ])
      .addSelect(`1 - (chunk.embedding <=> :queryVector)`, 'similarity')
      .where('chunk.tokenSlug = :tokenSlug', { tokenSlug })
      .andWhere(`1 - (chunk.embedding <=> :queryVector) > :threshold`, {
        queryVector: `[${queryVector.join(',')}]`,
        threshold: similarityThreshold
      })
      .orderBy('similarity', 'DESC')
      .limit(topK)
      .getRawMany()

    return results.map(result => ({
      id: result.chunk_id,
      score: parseFloat(result.similarity),
      content: result.chunk_content,
      source: result.chunk_source,
      url: result.chunk_url,
      tokenSlug: result.chunk_tokenSlug,
      type: result.chunk_type
    }))
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [searchVectors] [error]:`, error)
    throw error
  }
}
```

### 4. Advanced Search Features

#### Hybrid Search Implementation
```typescript
async hybridSearch(
  query: string,
  queryVector: number[],
  tokenSlug: string,
  topK: number = 5
): Promise<SearchResult[]> {
  try {
    // Vector search
    const vectorResults = await this.searchVectors(
      queryVector,
      tokenSlug,
      topK,
      0.6 // Lower threshold for more results
    )

    // Keyword search
    const keywordResults = await this.documentChunkRepository
      .createQueryBuilder('chunk')
      .select([
        'chunk.id',
        'chunk.content',
        'chunk.source',
        'chunk.url',
        'chunk.tokenSlug',
        'chunk.type'
      ])
      .addSelect(`ts_rank(to_tsvector('english', chunk.content), plainto_tsquery('english', :query))`, 'rank')
      .where('chunk.tokenSlug = :tokenSlug', { tokenSlug })
      .andWhere(`to_tsvector('english', chunk.content) @@ plainto_tsquery('english', :query)`, { query })
      .orderBy('rank', 'DESC')
      .limit(topK)
      .getRawMany()

    // Combine and rerank results
    return this.combineAndRerankResults(vectorResults, keywordResults, topK)
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [hybridSearch] [error]:`, error)
    throw error
  }
}

private combineAndRerankResults(
  vectorResults: SearchResult[],
  keywordResults: SearchResult[],
  topK: number
): SearchResult[] {
  const combined = new Map<string, SearchResult>()
  
  // Add vector results with higher weight
  vectorResults.forEach(result => {
    combined.set(result.id, { ...result, score: result.score * 0.7 })
  })
  
  // Add keyword results
  keywordResults.forEach(result => {
    const existing = combined.get(result.id)
    if (existing) {
      // Boost score if found in both
      existing.score = Math.max(existing.score, result.score * 0.3)
    } else {
      combined.set(result.id, { ...result, score: result.score * 0.3 })
    }
  })

  // Sort by score and return top results
  return Array.from(combined.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
```

#### Filtered Search
```typescript
async searchWithFilters(
  queryVector: number[],
  filters: {
    tokenSlug: string
    source?: string
    type?: string
    dateRange?: { from: Date; to: Date }
  },
  topK: number = 5
): Promise<SearchResult[]> {
  try {
    let query = this.documentChunkRepository
      .createQueryBuilder('chunk')
      .select([
        'chunk.id',
        'chunk.content',
        'chunk.source',
        'chunk.url',
        'chunk.tokenSlug',
        'chunk.type',
        'chunk.metadata'
      ])
      .addSelect(`1 - (chunk.embedding <=> :queryVector)`, 'similarity')
      .where('chunk.tokenSlug = :tokenSlug', { tokenSlug: filters.tokenSlug })

    // Apply filters
    if (filters.source) {
      query = query.andWhere('chunk.source = :source', { source: filters.source })
    }

    if (filters.type) {
      query = query.andWhere('chunk.type = :type', { type: filters.type })
    }

    if (filters.dateRange) {
      query = query.andWhere('chunk.createdAt BETWEEN :from AND :to', {
        from: filters.dateRange.from,
        to: filters.dateRange.to
      })
    }

    const results = await query
      .setParameter('queryVector', `[${queryVector.join(',')}]`)
      .andWhere(`1 - (chunk.embedding <=> :queryVector) > :threshold`, {
        threshold: 0.7
      })
      .orderBy('similarity', 'DESC')
      .limit(topK)
      .getRawMany()

    return results.map(result => ({
      id: result.chunk_id,
      score: parseFloat(result.similarity),
      content: result.chunk_content,
      source: result.chunk_source,
      url: result.chunk_url,
      tokenSlug: result.chunk_tokenSlug,
      type: result.chunk_type
    }))
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [searchWithFilters] [error]:`, error)
    throw error
  }
}
```

## 📊 Performance Optimization

### 1. Index Optimization

#### Vector Index Configuration
```sql
-- Create optimized vector index
CREATE INDEX CONCURRENTLY document_chunks_embedding_idx 
ON document_chunks USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- Create composite indexes
CREATE INDEX CONCURRENTLY document_chunks_token_type_idx 
ON document_chunks (tokenSlug, type);

-- Create text search index
CREATE INDEX CONCURRENTLY document_chunks_content_ts_idx 
ON document_chunks USING gin (to_tsvector('english', content));
```

#### Index Monitoring
```typescript
async getIndexStats(): Promise<IndexStats> {
  try {
    const stats = await this.documentChunkRepository.query(`
      SELECT 
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch
      FROM pg_stat_user_indexes 
      WHERE tablename = 'document_chunks'
    `)

    return {
      vectorIndex: stats.find(s => s.indexname === 'document_chunks_embedding_idx'),
      textIndex: stats.find(s => s.indexname === 'document_chunks_content_ts_idx'),
      compositeIndex: stats.find(s => s.indexname === 'document_chunks_token_type_idx')
    }
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [getIndexStats] [error]:`, error)
    throw error
  }
}
```

### 2. Query Optimization

#### Batch Operations
```typescript
async batchUpsertVectors(
  vectors: Vector[],
  tokenSlug: string,
  batchSize: number = 100
): Promise<void> {
  try {
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize)
      
      const chunks = batch.map(vector => ({
        id: vector.id,
        content: vector.metadata.content,
        source: vector.metadata.source,
        tokenSlug: vector.metadata.tokenSlug,
        type: vector.metadata.type,
        url: vector.metadata.url,
        embedding: vector.values,
        metadata: vector.metadata
      }))

      await this.documentChunkRepository.upsert(chunks, {
        conflictPaths: ['id'],
        skipUpdateIfNoValuesChanged: true
      })

      console.log(`[✅] [PostgresVectorService] [batchUpsertVectors] [batch ${i}-${i + batch.length}]:`, batch.length)
    }
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [batchUpsertVectors] [error]:`, error)
    throw error
  }
}
```

### 3. Caching Strategy

#### Search Result Caching
```typescript
@Injectable()
export class CachedPostgresVectorService extends PostgresVectorService {
  constructor(
    @InjectRepository(DocumentChunkEntity)
    documentChunkRepository: Repository<DocumentChunkEntity>,
    private readonly cacheService: CacheService
  ) {
    super(documentChunkRepository)
  }

  async searchVectors(
    queryVector: number[],
    tokenSlug: string,
    topK: number = 5,
    similarityThreshold: number = 0.7
  ): Promise<SearchResult[]> {
    const cacheKey = `vector_search:${tokenSlug}:${this.hashVector(queryVector)}:${topK}:${similarityThreshold}`
    
    // Try cache first
    const cached = await this.cacheService.get<SearchResult[]>(cacheKey)
    if (cached) {
      console.log(`[✅] [CachedPostgresVectorService] [searchVectors] [cache_hit]`)
      return cached
    }

    // Perform search
    const results = await super.searchVectors(queryVector, tokenSlug, topK, similarityThreshold)
    
    // Cache results for 1 hour
    await this.cacheService.set(cacheKey, results, 3600)
    
    console.log(`[✅] [CachedPostgresVectorService] [searchVectors] [cache_miss]`)
    return results
  }

  private hashVector(vector: number[]): string {
    return require('crypto')
      .createHash('md5')
      .update(vector.join(','))
      .digest('hex')
  }
}
```

## 🔍 Monitoring & Analytics

### 1. Performance Monitoring

#### Query Performance
```typescript
async getSearchPerformance(): Promise<SearchPerformance> {
  try {
    const stats = await this.documentChunkRepository.query(`
      SELECT 
        query,
        calls,
        total_time,
        mean_time,
        stddev_time,
        rows
      FROM pg_stat_statements 
      WHERE query LIKE '%document_chunks%'
      ORDER BY total_time DESC
      LIMIT 10
    `)

    return {
      topQueries: stats,
      averageResponseTime: stats.reduce((sum, stat) => sum + parseFloat(stat.mean_time), 0) / stats.length,
      totalCalls: stats.reduce((sum, stat) => sum + parseInt(stat.calls), 0)
    }
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [getSearchPerformance] [error]:`, error)
    throw error
  }
}
```

### 2. Health Monitoring

#### Database Health Check
```typescript
async healthCheck(): Promise<HealthStatus> {
  try {
    // Check vector extension
    const extension = await this.documentChunkRepository.query(`
      SELECT * FROM pg_extension WHERE extname = 'vector'
    `)

    // Check vector index
    const index = await this.documentChunkRepository.query(`
      SELECT * FROM pg_indexes WHERE tablename = 'document_chunks' AND indexname = 'document_chunks_embedding_idx'
    `)

    // Check table stats
    const stats = await this.documentChunkRepository.query(`
      SELECT 
        COUNT(*) as total_chunks,
        COUNT(DISTINCT tokenSlug) as unique_tokens,
        AVG(array_length(embedding, 1)) as avg_vector_dimension
      FROM document_chunks
    `)

    return {
      status: 'healthy',
      vectorExtension: extension.length > 0,
      vectorIndex: index.length > 0,
      totalChunks: parseInt(stats[0].total_chunks),
      uniqueTokens: parseInt(stats[0].unique_tokens),
      avgVectorDimension: parseFloat(stats[0].avg_vector_dimension),
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [healthCheck] [error]:`, error)
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

#### Cleanup Old Data
```typescript
async cleanupOldData(daysOld: number = 30): Promise<void> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await this.documentChunkRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute()

    console.log(`[✅] [PostgresVectorService] [cleanupOldData] [deleted]:`, result.affected)
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [cleanupOldData] [error]:`, error)
    throw error
  }
}
```

### 2. Index Maintenance

#### Reindex Vector Index
```typescript
async reindexVectorIndex(): Promise<void> {
  try {
    await this.documentChunkRepository.query(`
      REINDEX INDEX CONCURRENTLY document_chunks_embedding_idx
    `)

    console.log(`[✅] [PostgresVectorService] [reindexVectorIndex] [completed]`)
  } catch (error) {
    console.error(`[🔴] [PostgresVectorService] [reindexVectorIndex] [error]:`, error)
    throw error
  }
}
```

## 🎯 Best Practices

### 1. Performance Tips
- Sử dụng ivfflat index cho vector search
- Tạo composite indexes cho filtering
- Sử dụng batch operations cho large datasets
- Monitor query performance thường xuyên

### 2. Data Management
- Regular cleanup old data
- Monitor index usage
- Optimize query patterns
- Use appropriate similarity thresholds

### 3. Monitoring
- Track search performance
- Monitor index health
- Alert on slow queries
- Regular maintenance tasks

---

**PostgreSQL Vector Team** - Agent PRTGE

*Last updated: [Current Date]*
