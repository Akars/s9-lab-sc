// eslint-disable-next-line max-classes-per-file
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
    // eslint-disable-next-line no-unused-vars
    public injectedResources: DataSourceInjected,
    // eslint-disable-next-line no-empty-function
  ) {}
}
