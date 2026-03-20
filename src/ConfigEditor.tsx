import React, { ChangeEvent } from 'react';
import { InlineField, Input } from '@grafana/ui';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { MyDataSourceOptions, MySecureJsonData } from './shared/types';

interface Props extends DataSourcePluginOptionsEditorProps<MyDataSourceOptions, MySecureJsonData> {}

export const ConfigEditor: React.FC<Props> = ({ onOptionsChange, options }) => {
  const { jsonData } = options;

  const onHostnameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({
      ...options,
      jsonData: {
        ...jsonData,
        hostname: event.target.value,
      },
    });
  };

  return (
    <InlineField label="Hostname" labelWidth={20} tooltip="The hostname or IP address of your Netdata Agent">
      <Input
        value={jsonData.hostname || ''}
        placeholder="The hostname of your Netdata Agent"
        width={40}
        onChange={onHostnameChange}
      />
    </InlineField>
  );
};
