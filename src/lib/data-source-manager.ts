import { Service } from 'typedi';
import { AppDataSource } from './data-source';

@Service()
class DataSourceInjected {
  getDataSourceManager() {
    return AppDataSource.manager;
  }
}

@Service()
export class Manager {
  constructor(
    public injectedResources: DataSourceInjected,
  ) {}
}
