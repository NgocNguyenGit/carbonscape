import React, { Component } from "react";
// import * as atlas from "azure-maps-control";
import Head from "next/head";

export class index extends Component {
	componentDidMount() {
		var map, datasource;

		map = new atlas.Map("myMap", {
			center: [35.9078, 127.7669],
			zoom: 3,
      language: "en-US",
      style: 'grayscale_dark',
			authOptions: {
				authType: "subscriptionKey",
				subscriptionKey: "C570VXYfVEQCjJ-_EyYYIMIlM_PJOb6QUxIls-0Dmmw",
			},
		});
		map.events.add("ready", function () {
			//Create a data source and add it to the map.
			datasource = new atlas.source.DataSource(null, {
				//Tell the data source to cluster point data.
				cluster: true,

				//The radius in pixels to cluster points together.
				clusterRadius: 15,
			});
			map.sources.add(datasource);

			//Create a heatmap and add it to the map.
			map.layers.add(
				new atlas.layer.HeatMapLayer(datasource, null, {
					//Set the weight to the point_count property of the data points.
					weight: ["get", "point_count"],

					//Optionally adjust the radius of each heat point.
					radius: 20,
				}),
				"labels"
			);

			//Load a data set of points, in this case earthquake data from the USGS.
			datasource.importDataFromUrl(
				"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
			);
		});
	}
	render() {
		return (
			<>
				<Head>
					<link
						rel="stylesheet"
						href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css"
						type="text/css"
					/>
					<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
					<style jsx>
						{`
							body {
								margin: 0;
								padding: 0;
							}
						`}
					</style>
				</Head>
				<div
					id="myMap"
					style={{ height: "100vh", width: "100%" }}
				></div>
			</>
		);
	}
}

export default index;
