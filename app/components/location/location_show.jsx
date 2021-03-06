import React from 'react';
import { Container } from 'semantic-ui-react';
import FeedContainer from '../feed/feed_container';
import Loading from '../shared/loading';

class LocationShow extends React.Component {
	componentWillMount() {
		this.props.updateFilters({
			resource: 'locations',
			id: this.props.id
		});

		this.state = {
			loadingAnotherLocation: false
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.id !== this.props.id) {
			this.setState({ loadingAnotherLocation: true });
			this.props.updateFilters({ resource: 'locations', id: nextProps.id });
		}

		if (this.props.loadingFeed && !nextProps.loadingFeed) {
			this.setState({ loadingAnotherLocation: false });
		}
	}

	render() {
		if (
			(this.props.loadingFeed && !this.props.tracksPage) ||
			this.state.loadingAnotherLocation ||
			!this.props.location.name
		) {
			return <Loading />;
		} else {
			return (
				<Container className="main-content track-show">
					<h2>
						Top tracks in{' '}
						<span style={{ fontWeight: 'bold' }}>
							{' '}{this.props.location.name}{' '}
						</span>
					</h2>

					<FeedContainer />
				</Container>
			);
		}
	}
}

export default LocationShow;
