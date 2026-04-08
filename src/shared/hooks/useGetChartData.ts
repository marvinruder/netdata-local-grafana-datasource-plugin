import { GroupByList, Methods } from './../constants';
import { Get } from 'shared/utils/request';

type UseGetChartDataType = {
  from: number;
  to: number;
  maxDataPoints?: number;
  nodes?: string[];
  dimensions?: string[];
  contextId?: string;
  groupBy?: string;
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
  groupBy = GroupByList[0].value,
  method = Methods[0].value,
  group = 'average',
  dimensions = [],
  from,
  to,
  maxDataPoints,
}: UseGetChartDataType) => {
  let group_by: string[], group_by_label: string[];

  switch (groupBy) {
    case 'node':
      group_by = ['node'];
      group_by_label = [];
      break;
    case 'dimension':
      group_by = ['dimension'];
      group_by_label = [];
      break;
    case 'instance':
      group_by = ['instance'];
      group_by_label = [];
      break;
    default:
      group_by = ['label'];
      group_by_label = [groupBy];
      break;
  }

  const defaultSelectorValue = ['*'];
  const labels = filterBy && filterValue ? [`${filterBy}:${filterValue}`] : [];

  return await Get({
    path: `/v3/data`,
    baseUrl,
    params: {
      format: 'json2',
      options: ['jsonwrap', 'flip', 'ms'],
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
      group_by,
      group_by_label,
      time_group: group,
      time_resampling: 0,
      after: from,
      before: to,
      points: maxDataPoints || 269,
    },
  });
};
