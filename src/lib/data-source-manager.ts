import { Service } from 'typedi';
import { getAppDataSource } from './data-source';

@Service()
class DataSourceInjected {
  async getDataSourceManager() {
    return (await getAppDataSource()).manager;
  }
}

@Service()
export class Manager {
  constructor(
    public injectedResources: DataSourceInjected,
  ) {}
}
