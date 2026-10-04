import { Get } from '../utils/request';
import { Methods } from './../constants';
import { buildGrouping } from 'shared/utils/grouping';

type UseGetChartDataType = {
  from: number;
  to: number;
  maxDataPoints?: number;
  nodes?: string[];
  dimensions?: string[];
  contextId?: string;
  groupBy?: string | string[];
  method?: string;
  group?: string;
  filterBy?: string;
  filterValue?: string;
  baseUrl: string;
};

export const useGetChartData = async ({
  baseUrl,
  nodes = [],
  contextId,
  filterBy,
  filterValue,
  groupBy,
  method = Methods[0].value,
  group = 'average',
  dimensions = [],
  from,
  to,
  maxDataPoints,
}: UseGetChartDataType) => {
  const metrics = [{ aggregation: method, ...buildGrouping(groupBy) }];

  const defaultSelectorValue = ['*'];
  const labels = filterBy && filterValue ? [`${filterBy}:${filterValue}`] : [];

  return await Get({
    path: `/v3/data`,
    baseUrl,
    params: {
      format: 'json2',
      options: ['jsonwrap', 'flip', 'ms', 'group-by-labels'],
      scope_contexts: [contextId],
      scope_nodes: nodes,
      scope_dimensions: dimensions,
      scope_labels: labels,
      contexts: defaultSelectorValue,
      nodes: defaultSelectorValue,
      instances: defaultSelectorValue,
      dimensions: dimensions.length ? dimensions : defaultSelectorValue,
      labels: labels.length ? labels : defaultSelectorValue,
      aggregation: method,
      group_by: metrics.map(({ group_by }) => group_by),
      group_by_label: metrics.map(({ group_by_label }) => group_by_label).join(','),
      time_group: group,
      time_resampling: 0,
      after: from,
      before: to,
      points: maxDataPoints || 269,
    },
  });
};
