# netdata-local data source for Grafana

> [!NOTE]
> This plugin is a fork of the [original Netdata data source plugin for Grafana](https://grafana.com/grafana/plugins/netdatacloud-netdata-datasource/). While the upstream plugin is only capable of connecting to Netdata Cloud and thus can only be used to visualize data from Netdata Agents connected to Netdata Cloud, this plugin is designed to connect to the API of local Netdata Agents, making it possible to visualize data from any node with a running Netdata Agent, regardless of whether it is connected to Netdata Cloud or not. If you prefer to integrate your nodes with Netdata Cloud and visualize them in Grafana, you can use the original Netdata data source plugin.

_Enhanced high-fidelity troubleshooting data source for the Open Source community!_

![Image](https://user-images.githubusercontent.com/82235632/193311991-a6d167ab-b845-49b7-817c-976b780e427e.png)

## What is netdata-local data source plugin for Grafana?

With this data source plugin we expose the troubleshooting capabilities of local Netdata Agents in Grafana, making them available more widely. Some of the key capabilities:
- Real-time monitoring with single-second granularity.
- Installation and out-of-the-box integrations available in seconds from one line of code.
- 2,000+ metrics from across your whole Infrastructure, with insightful metadata associated with them.


## Getting started

### 1. Connect your Nodes to your Netdata Agent

The netdata-local data source plugin connects directly to the API of your local Netdata Agent, meaning that you don’t need to have your nodes (hosts) connected to [Netdata Cloud](https://app.netdata.cloud/) in order to be able to have them exposed on our plugin. For now, no authentication is implemented, so we recommend to use Netdata web server configuration options like `allow connections from` to isolate your Netdata Agent from other networks.

> Netdata Agent will need to be installed and running on your server, VM and/or cluster, so that it can start collecting all the relevant metrics you have from the server and applications running on it. More info at https://learn.netdata.cloud/docs/get-started.

### 2. Connect more Netdata Agents to a Netdata Parent

To connect to multiple Netdata Agents, you will have to set up a Netdata Parent, which will allow you to connect multiple child Netdata Agents to it and have all their data exposed through the Parent’s API. This way, you can connect the netdata-local data source plugin to the Parent and have access to all the data from the connected children. Read more about how to set up a Netdata Parent and connect your Agents to it in the [official Netdata documentation](https://learn.netdata.cloud/docs/netdata-parents).

### 3. Install netdata-local data source plugin

### 4. Add your hostname to the netdata-local data source plugin configuration

Once you have added the hostname of your Netdata Agent to netdata-local data source plugin you’re ready to start taking advantage of Netdata’s troubleshooting capabilities in Grafana by starting creating your charts and dashboards!

![image](https://user-images.githubusercontent.com/82235632/189398814-1efbf1c7-1a62-4d5f-abe8-6a9297a3f008.png)
