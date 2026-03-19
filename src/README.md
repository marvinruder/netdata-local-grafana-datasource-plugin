# Netdata data source for Grafana

_Enhanced high-fidelity troubleshooting data source for the Open Source community!_

![Image](https://user-images.githubusercontent.com/82235632/193311991-a6d167ab-b845-49b7-817c-976b780e427e.png)

## What is Netdata data source plugin for Grafana?

<!-- We are huge fans of Open Source culture and it is rooted deeply into our DNA, so we thought that the Open Source community would hugely benefit from Netdata providing a Grafana data source plugin that would expose its powerful data collection engine. -->

With this data source plugin we expose the troubleshooting capabilities of Netdata in Grafana, making them available more widely. Some of the key capabilities:
- Real-time monitoring with single-second granularity.
- Installation and out-of-the-box integrations available in seconds from one line of code.
- 2,000+ metrics from across your whole Infrastructure, with insightful metadata associated with them.
- Access to our fresh ML metrics (anomaly rates) - exposing our ML capabilities at the edge!


## Getting started

### 1. Connect your Nodes to your Netdata instance

The Netdata data source plugin connects directly to the API of your local Netdata instance, meaning that you don’t need to have your nodes (hosts) connected to [Netdata Cloud](https://app.netdata.cloud/) in order to be able to have them exposed on our plugin. For now, no authentication is implemented, so we recommend to use Netdata web server configuration options like `allow connections from` to isolate your Netdata instance from other networks.

> Netdata Agent will need to be installed and running on your server, VM and/or cluster, so that it can start collecting all the relevant metrics you have from the server and applications running on it. More info at https://learn.netdata.cloud/docs/get-started.

### 2. Install Netdata data source plugin

### 3. Add your hostname to the Netdata data source plugin configuration

Once you have added the hostname of your Netdata instance to Netdata data source plugin you’re ready to start taking advantage of Netdata’s troubleshooting capabilities in Grafana by starting creating your charts and dashboards!

![image](https://user-images.githubusercontent.com/82235632/189398814-1efbf1c7-1a62-4d5f-abe8-6a9297a3f008.png)
