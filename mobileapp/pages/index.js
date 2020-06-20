import Head from "next/head";
import Axios from "axios";

export default class Home extends React.Component {
	state = {
		data: [],
	};
	componentWillMount() {
		Axios.get(
			"https://hackovidxheatmap.azurewebsites.net/api/cousage"
		).then((response) => {
			this.setState({ data: response.data });
		});
	}
	componentDidMount() {
		window.location.href = "/heatmap/index.html";
	}
	render() {
		return (
			<div className="container">
				<Head>
					<title>Carbonscape</title>
				</Head>
			</div>
		);
	}
}
