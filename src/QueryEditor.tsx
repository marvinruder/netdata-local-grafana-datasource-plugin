import React, { useState } from 'react';
import { Input, InlineField, InlineFieldRow, MultiSelect, Select, useStyles2 } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';
import { DataSource } from './datasource';
import { MyDataSourceOptions, MyQuery } from './shared/types';
import { useFetchContexts } from 'shared/hooks/useFetchContexts';
import { useFetchNodes } from 'shared/hooks/useFetchNodes';
import { Aggreagations, GroupByList, Methods } from 'shared/constants';
import { Dropdown } from 'shared/types/dropdown.interface';
import {
  getDimensions,
  getFilters,
  getGroupingByList,
  defaultFilter,
  normalizeGroupBy,
} from 'shared/utils/transformations';
import { chartDataTopic } from 'shared/utils/topics';
import PubSub from 'pubsub-js';
import { getTemplateSrv } from '@grafana/runtime';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

const getStyles = () => ({
  mt: css`
    margin-top: 8px;
  `,
});

const QueryEditor: React.FC<Props> = ({ datasource, query, range, onChange, onRunQuery }) => {
  const styles = useStyles2(getStyles);
  const { baseUrl } = datasource;
  const from = range!.from.valueOf();
  const to = range!.to.valueOf();
  const after = Math.floor(from);
  const before = Math.floor(to);

  const [selectedFilter, setSelectedFilter] = React.useState<Dropdown>();
  const [selectedFilterValue, setSelectedFilterValue] = React.useState<Dropdown>();
  const [totalInstances, setTotalInstances] = React.useState<number>(0);
  const [totalNodes, setTotalNodes] = React.useState<number>(0);

  const [selectedNodes, setSelectedNodes] = React.useState<SelectableValue<string[]>>();

  const [selectedContext, setSelectedContext] = React.useState<Dropdown>({
    label: query.contextId,
    value: query.contextId,
  });
  const [selectedDimensions, setSelectedDimensions] = React.useState<Dropdown[]>();
  const [selectedGroupBy, setSelectedGroupBy] = React.useState<Dropdown[]>([GroupByList[0]]);
  const [selectedMethod, setSelectedMethod] = React.useState<Dropdown>(Methods[0]);
  const [selectedAggregations, setSelectedAggregations] = React.useState<Dropdown>(Aggreagations[0]);
  const [filterByValues, setFilterByValues] = React.useState<Dropdown[]>([]);

  const { nodes, fetchNodes } = useFetchNodes(baseUrl);
  const { contexts, fetchContexts } = useFetchContexts(baseUrl);
  const [allDimensions, setAllDimensions] = useState([]);
  const [units, setUnits] = useState('');
  const [filters, setFilters] = useState<any>(defaultFilter);
  const [groupingByList, setGroupingByList] = useState<Dropdown[]>(GroupByList);

  const variables = getTemplateSrv().getVariables()?.map((v) => ({ name: `Variable: ${v.label || v.name}`, id: `$${v.name}` }));
  const filterList = React.useMemo(() => Object.keys(filters).map((s) => ({ label: s, value: s })), [filters]);
  const nodeList = React.useMemo(() => [...nodes, ...variables].map((c: any) => ({ label: c.name, value: c.id })), [nodes]);

  const { nodes: allNodes, dimensions, groupBy, contextId, filterBy, filterValue } = query;

  // held locally so typing does not re-run the query on every keystroke
  const [legend, setLegend] = React.useState<string>(query.legend || '');

  React.useEffect(() => {
    setLegend(query.legend || '');
  }, [query.legend]);

  const mySubscriber = (msg: any, data: any) => {
    const { summary, view } = data?.data || {};
    const { nodes = [], instances = [], labels = [] } = summary || {};
    const { dimensions, units } = view || {};
    setFilters(getFilters(labels));
    setGroupingByList(getGroupingByList(labels));
    setAllDimensions(getDimensions(dimensions));
    setUnits(units);
    setTotalNodes(nodes.length);
    setTotalInstances(instances.length);
  };

  const isGroupFunctionAvailable = React.useCallback(() => {
    const active = [...normalizeGroupBy(groupBy), ...selectedGroupBy.map(({ value }) => value)];

    if (active.includes('instance')) {
      return false;
    }
    if (totalInstances === 1) {
      return false;
    }
    if (active.includes('dimension')) {
      return true;
    }
    return totalInstances > 0 && totalInstances > totalNodes;
  }, [totalInstances, groupBy, totalNodes, selectedGroupBy]);

  React.useEffect(() => {
    const token = PubSub.subscribe(chartDataTopic(query.refId), mySubscriber);

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [query.refId]); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    fetchNodes();
    fetchContexts();
  }, [fetchContexts, fetchNodes, after, before]);

  React.useEffect(() => {
    // eslint-disable-line
    if (allNodes && nodes.length > 0) {
      const filteredNodes: any[] = [];
      allNodes.forEach((element) => {
        let currentNode: any = [...nodes, ...variables].find((n: any) => n.id === element);
        filteredNodes.push({ label: currentNode?.name, value: currentNode?.id });
      });

      setSelectedNodes(filteredNodes);
    }
  }, [allNodes, nodes]); // eslint-disable-line

  React.useEffect(() => {
    if (contextId) {
      const filteredNodes: any[] = [];

      if (allNodes && nodes.length > 0) {
        allNodes.forEach((element) => {
          let currentNode: any = [...nodes, ...variables].find((n: any) => n.id === element);
          filteredNodes.push({ label: currentNode?.name, value: currentNode?.id });
        });
      }
    }
  }, [contextId]); // eslint-disable-line

  React.useEffect(() => {
    if (dimensions && dimensions.length > 0) {
      const tempDimensions = dimensions.map((d: string) => ({ label: d, value: d }));

      setSelectedDimensions(tempDimensions);
    }

    const groupByList = normalizeGroupBy(groupBy);

    if (groupByList.length) {
      setSelectedGroupBy(groupByList.map((value) => ({ label: value, value })));
    }
  }, [dimensions, groupBy]);

  React.useEffect(() => {
    if (filters && filterBy && filterValue) {
      setSelectedFilter({ label: filterBy, value: filterBy });
      setSelectedFilterValue({ label: filterValue, value: filterValue });
    }
  }, [filterBy, filterValue, filters]);

  const onContextIdChange = (v: SelectableValue<string>) => {
    setSelectedContext(v);

    // reset the rest of inputs
    setSelectedDimensions([]);
    setSelectedGroupBy([GroupByList[0]]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    onChange({ ...query, contextId: v.value });
    onRunQuery();
  };

  const onNodesChange = (v: SelectableValue<string[]>) => {
    const data = v.map((n: any) => n.value);

    // reset the rest of inputs
    setSelectedDimensions([]);
    setSelectedGroupBy([GroupByList[0]]);
    setSelectedFilter({});
    setSelectedFilterValue({});
    setSelectedMethod(Methods[0]);
    setSelectedAggregations(Aggreagations[0]);

    setSelectedNodes(data);
    onChange({ ...query, contextId, nodes: data } as MyQuery);
    onRunQuery();
  };

  const onDimensionsChange = (v: SelectableValue<string[]>) => {
    const data = v.map((n: any) => n.value);
    setSelectedDimensions(data);
    onChange({ ...query, dimensions: data });
    onRunQuery();
  };

  const onGroupByChange = (v: Array<SelectableValue<string>>) => {
    const data: Dropdown[] = (v || []).filter(({ value }) => !!value) as Dropdown[];

    setSelectedGroupBy(data);
    onChange({ ...query, groupBy: data.map(({ value }) => value as string) });
    onRunQuery();
  };

  const onFilterByChange = (v: SelectableValue<string>) => {
    setSelectedFilter(v);
    setSelectedFilterValue({});

    if (v.value === 'No filter') {
      onChange({ ...query, filterBy: undefined, filterValue: undefined });
      onRunQuery();
    } else {
      setFilterByValues(filters[v?.value || ''].map((v: string) => ({ label: v, value: v })));
    }
  };

  const onFilterValueChange = (v: SelectableValue<string>) => {
    setSelectedFilterValue(v);
    onChange({ ...query, filterBy: selectedFilter?.value, filterValue: v.value });
    onRunQuery();
  };

  const onMethodChange = (v: SelectableValue<string>) => {
    setSelectedMethod(v);
    onChange({ ...query, method: v.value });
    onRunQuery();
  };

  const commitLegend = () => {
    if ((query.legend || '') === legend) {
      return;
    }

    onChange({ ...query, legend });
    onRunQuery();
  };

  const onAggreagationChange = (v: SelectableValue<string>) => {
    setSelectedAggregations(v);
    onChange({ ...query, group: v.value });
    onRunQuery();
  };

  return (
    <>
      <InlineFieldRow className={styles.mt}>
        <InlineField label="Nodes" tooltip="No selected Nodes means 'All Nodes'" grow>
          <Select
            options={nodeList}
            value={selectedNodes}
            onChange={onNodesChange}
            allowCustomValue
            isSearchable
            isMulti
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow className={styles.mt}>
        <InlineField label="Context*" grow>
          <Select
            options={contexts}
            value={selectedContext}
            onChange={onContextIdChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>

        <InlineField label="Dimensions" grow>
          <Select
            options={allDimensions}
            value={selectedDimensions}
            onChange={onDimensionsChange}
            allowCustomValue
            isSearchable
            isMulti
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow className={styles.mt}>
        <InlineField
          label="Grouping by*"
          tooltip="Select more than one to split the series further, e.g. node together with a label to tell hosts apart in a single panel."
          grow
        >
          <MultiSelect
            options={groupingByList}
            value={selectedGroupBy}
            onChange={onGroupByChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>

        <InlineField
          label="Grouping function*"
          tooltip="The aggregation function to be applied when multiple data sources exists for one node (multiple instances). This is disabled when not applicable."
          grow
        >
          <Select
            disabled={!isGroupFunctionAvailable()}
            options={Methods}
            value={selectedMethod}
            onChange={onMethodChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>

        <InlineField label="Aggregation function*" tooltip="Aggregation function over time" grow>
          <Select
            options={Aggreagations}
            value={selectedAggregations}
            onChange={onAggreagationChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow className={styles.mt}>
        <InlineField label="Filter by" grow>
          <Select
            options={filterList}
            value={selectedFilter}
            onChange={onFilterByChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>

        <InlineField label="Value" grow>
          <Select
            options={filterByValues}
            value={selectedFilterValue}
            onChange={onFilterValueChange}
            allowCustomValue
            isSearchable
          />
        </InlineField>
      </InlineFieldRow>

      <InlineFieldRow className={styles.mt}>
        <InlineField label="Unit" grow>
          <Input value={units} disabled />
        </InlineField>

        <InlineField
          label="Legend"
          tooltip="Name the series yourself, e.g. {{node}} or {{node}} - {{mount_point}}. Use {{name}} for the name the query returned, and any label key shown in the legend. Leave empty to let Grafana name the series."
          grow
        >
          <Input
            value={legend}
            placeholder="{{node}}"
            onChange={(e) => setLegend(e.currentTarget.value)}
            onBlur={commitLegend}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                commitLegend();
              }
            }}
          />
        </InlineField>
      </InlineFieldRow>
    </>
  );
};

export { QueryEditor };
