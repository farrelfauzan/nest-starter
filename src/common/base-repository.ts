import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITIY_MANAGER_KEY } from './transaction.interceptor';
import { Request } from 'express';

export class BaseRepository {
  constructor(
    private dataSource: DataSource,
    private request: Request,
  ) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {
    const entityManager: EntityManager =
      this.request[ENTITIY_MANAGER_KEY] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}
