// eslint-disable-next-line max-classes-per-file
import { Service } from 'typedi';
import { AppDataSource } from '../DataSource';

@Service()
class DataSourceInjected {
  getDataSourceManager() {
    return AppDataSource.manager;
  }
}

@Service()
export class Manager {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    // eslint-disable-next-line no-unused-vars
    public injectedResources: DataSourceInjected,
    // eslint-disable-next-line no-empty-function
  ) {}
}
