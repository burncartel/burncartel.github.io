import { connect } from 'react-redux';
import { updateFilters, setFireFeed } from '../../actions/feed_actions';
import Home from './home';

// how do i get rid of this obj without breaking everything?
const mapStateToProps = (state) => ({});

const mapDispatchToProps = dispatch => ({
	updateFilters: (filters) => dispatch(updateFilters(filters)),
	setFireFeed: () => dispatch(setFireFeed())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
