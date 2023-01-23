import { Service } from 'typedi';
import { AppDataSource } from './DataSource';

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
