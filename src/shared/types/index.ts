import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MyQuery extends DataQuery {
  contextId?: string;
  nodes?: string[];
  // string is kept for dashboards saved before multi-grouping; normalizeGroupBy() collapses both forms
  groupBy?: string | string[];
  method?: string;
  dimensions?: string[];
  group?: string;
  filterBy?: string;
  filterValue?: string;
  // legend template, e.g. "{{node}}"; empty leaves the naming to Grafana
  legend?: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface MyDataSourceOptions extends DataSourceJsonData {
  hostname?: string;
}
/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MySecureJsonData {}
