import React, { Component } from "react";
// import * as atlas from "azure-maps-control";
import Head from "next/head";

export class index extends Component {
	componentDidMount() {
		var map, datasource;

		function calculateLineEndPoints(lines) {
			var points = [];
			for (var i = 0; i < lines.length; i++) {
				var p = calculateLineEndPoint(lines[i]);
				if (p) {
					points.push(p);
				}
			}

			return points;
		}

		function calculateLineEndPoint(line) {
			var l = null;

			if (line instanceof atlas.Shape) {
				l = line.getCoordinates();
			} else if (line.type === "Feature") {
				l = line.geometry.coordinates;
			} else if (line.type === "LineString") {
				l = line.coordinates;
			}

			if (l && l.length >= 2) {
				//Calculate the heading from the second last coordinate to the last coordinate.
				//Since we want them to be pixel accurate rather than spatialy accurate, convert them to pixels (any zoom level will do but 20 will likely be more than accurate enough) and get the pixel heading.
				var pixels = atlas.math.mercatorPositionsToPixels(
					[l[l.length - 2], l[l.length - 1]],
					20
				);
				var heading = atlas.Pixel.getHeading(pixels[0], pixels[1]);

				//Use the last coordinate of the line for the point of the end.
				return new atlas.data.Feature(
					new atlas.data.Point(l[l.length - 1]),
					{
						heading: heading,
					}
				);
			}

			return null;
		}
		var lineData = [
			new atlas.data.LineString([
				[118.5654, 28.033],
				[123.5654, 25.033],
			]),

			new atlas.data.LineString([
				[110.5654, 22.033],
				[118.5654, 22.033],
				[122.5654, 25.033],
			]),

			new atlas.data.LineString([
				[135.7681, 35.0116],
				[130.5571, 31.5969],
				[123.5654, 25.033],
			]),

			new atlas.data.LineString([
				[124.9617, 11.2543],
				[121.7693, 16.0774],
				[121.8734, 17.1381],
				[123.5654, 24.033],
			]),
		];
		try {
			map = new atlas.Map("myMap", {
				center: [121.5654, 25.033],
				zoom: 5,
				language: "en-US",
				style: "grayscale_dark",
				authOptions: {
					authType: "subscriptionKey",
					subscriptionKey:
						"C570VXYfVEQCjJ-_EyYYIMIlM_PJOb6QUxIls-0Dmmw",
				},
			});
		} catch (ex) {}
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
			map.imageSprite
				.createFromTemplate(
					"arrow-icon",
					"triangle-arrow-up",
					"DarkOrchid",
					"DarkOrchid"
				)
				.then(function () {
					datasource = new atlas.source.DataSource();
					map.sources.add(datasource);
					var iconPromises = [
						map.imageSprite.add(
							"warning_triangle_icon",
							"/warning_triangle_icon.png"
						),
					];
					datasource.add(lineData);

					datasource.add(calculateLineEndPoints(lineData));

					map.layers.add([
						//Add a line layer for displaying the line.
						new atlas.layer.LineLayer(datasource, null, {
							strokeColor: "dodgerblue",
							strokeWidth: 3,
						}),

						//Add a symbol layer for rendering the arrow along the line.
						new atlas.layer.SymbolLayer(datasource, null, {
							iconOptions: {
								image: "arrow-icon",
								allowOverlap: true,
								anchor: "top",
								rotationAlignment: "map",
								rotation: ["get", "heading"],
								size: 0.7,
							},
							filter: ["==", ["geometry-type"], "Point"],
						}),
					]);
					map.imageSprite
						.add(
							"warning_triangle_icon",
							"/warning_triangle_icon.png"
						)
						.then(function () {
							var datasource = new atlas.source.DataSource();
							map.sources.add(datasource);

							datasource.add(
								new atlas.data.Feature(
									new atlas.data.Point([
										114.1694,
										22.3193,
									]),
									{
										temperature: 350,
									}
								)
							);

							//Add a layer for rendering point data as symbols.
							map.layers.add(
								new atlas.layer.SymbolLayer(datasource, null, {
									iconOptions: {
										image: "warning_triangle_icon",

										size: 0.1,
									},
									textOptions: {
										textField: [
											"concat",
											"AQI: ",
											[
												"to-string",
												["get", "temperature"],
											],
										],

										offset: [0, -2],
										color: 'orange'
									},
								})
							);
						});
				});
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
					<style global jsx>
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
