# netdata-local data source for Grafana

> [!NOTE]
> This plugin is a fork of the [original Netdata data source plugin for Grafana](https://github.com/netdata/netdata-grafana-datasource-plugin). While the upstream plugin is only capable of connecting to Netdata Cloud and thus can only be used to visualize data from Netdata Agents connected to Netdata Cloud, this plugin is designed to connect to the API of local Netdata Agents, making it possible to visualize data from any node with a running Netdata Agent, regardless of whether it is connected to Netdata Cloud or not. If you prefer to integrate your nodes with Netdata Cloud and visualize them in Grafana, you can use the original Netdata data source plugin.

_Enhanced high-fidelity troubleshooting data source for the Open Source community!_

![Image](https://user-images.githubusercontent.com/82235632/193311991-a6d167ab-b845-49b7-817c-976b780e427e.png)

## How to install the plugin?

To start using the netdata-local data source plugin on your Grafana environment, local or Cloud. Here are some tips to get through this depending on your setup:
* Directly through the Grafana UI
* Docker
* Linux (local)
* Windows (local - powershell)
* Building the plugin locally

The installations below will use different tools like: curl, docker, jq, wget, unzip and xcopy.

### Directly through the Grafana UI

netdata-local is available in the Grafana Plugin catalog that can be accessed from the Grafana UI. 
For details on how to: use the Plugin catalog, manage the plugins (install, update, uninstall), and other information, please check [this documentation](https://grafana.com/docs/grafana/latest/administration/plugin-management/#plugin-catalog).

### Docker

#### Pre-buit script - setup-demo-environment
We provide you a script `setup-demo-environment.sh` that will help you setting this up real fast.
To start the container with the netdata-local datasource plugin already installed you just need to:
```
setup-demo-environment.sh run
```

To remove container:
```
setup-demo-environment.sh remove
```

This script will:
1. Spin up a grafana container without starting grafana itself
1. Retrieve the latest available release of the netdata-local datasource plugin
1. Install the netdata-local datasource plugin in /var/lib/grafana/plugins
1. Start grafana

#### Manual step-by-step

1. Setup your grafana docker container with the the permissions to load netdata-local plugin

   ```
   docker run -d --name=grafana grafana/grafana
   ```

2. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   wget `curl -s https://api.github.com/repos/marvinruder/netdata-local-grafana-datasource-plugin/releases/latest | jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'`
   ```

3. Copy the contents of the netdata-local data source plugin to Grafana plugins directory, by default /var/lib/grafana/plugins

   ```
   unzip netdata-local-datasource-<version_number>.zip
   docker cp netdata-local-datasource grafana:/var/lib/grafana/plugins/
   ```

4. Restart grafana container
   
   ```
   docker restart grafana
   ```

### Linux (local)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases 

   ```
   wget `curl -s https://api.github.com/repos/marvinruder/netdata-local-grafana-datasource-plugin/releases/latest | jq -r '.assets[] | select(.name|match("zip$")) | .browser_download_url'`
   ```

2. Copy the contents of the netdata-local data source plugin to Grafana plugins directory, by default /var/lib/grafana/plugins

   ```
   unzip netdata-local-datasource-<version_number>.zip
   cp -rf netdata-local-datasource /var/lib/grafana/plugins
   ```

3. After adding the plugin a restart of grafana server is needed

   For init.d based services you can use the command:
   ```
   sudo service grafana-server restart
   ```

   For systemd based services you can use the following:
   ```
   systemctl restart grafana-server
   ```

### Windows (local - powershell)

1. Ensure you have the desired version of the plugin you want to install, get it from github releases by:
   * Going to https://github.com/marvinruder/netdata-local-grafana-datasource-plugin/releases/latest
   * Downloading the zip file with the latest release, e.g. netdata-local-datasource-1.0.12.zip

2. Copy the contents of the netdata-local data source plugin to the Grafana plugins directory, by default C:\Program Files\GrafanaLabs\grafana\data\plugins

   ```
   Expand-Archive \.netdata-local-datasource-<version_number>.zip \.
   xcopy .\netdata-local-datasource\ "C:\Program Files\GrafanaLabs\grafana\data\plugins\netdata-local-datasource\" /E
   ```

3. After adding the plugin a restart of grafana server is needed

   ```
   net stop Grafana
   net start Grafana
   ```

### Building the plugin locally

For any of the above steps if you prefer to build this plugin locally instead of retrieving it from from the releases you can:

1. Clone this repo 
   ```
   git clone https://github.com/marvinruder/netdata-local-grafana-datasource-plugin
   ```

2. Build it locally
   ```
   yarn
   yarn build
   ```

3. Place the contents of the `/dist` folder under the netdata-local folder in Grafana plugins directory.
