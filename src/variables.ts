import { CustomVariableSupport, MetricFindValue } from '@grafana/data';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataSource } from './datasource';
import { VariableQueryEditor } from './VariableQueryEditor';

export class MyVariableSupport extends CustomVariableSupport<DataSource> {
    editor = VariableQueryEditor;

  constructor(private datasource: DataSource) {
    super();
  }

  query(): Observable<{ data: MetricFindValue[] }> {
    return from(this.datasource.metricFindQuery()).pipe(map((data) => ({ data })));
  }
}