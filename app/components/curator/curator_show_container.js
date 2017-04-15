import { connect } from 'react-redux';
import { getCuratorFromTracks } from '../../selectors/curator_selector';
import { updateFilters } from '../../actions/feed_actions';
import CuratorShow from './curator_show';


// maybe use selectors here? this is weird.
const mapStateToProps = (state, ownProps) => ({
	id: ownProps.match.params.id,
	user: getCuratorFromTracks(state)
});

const mapDispatchToProps = (dispatch) => ({
  updateFilters: (filters) => dispatch(updateFilters(filters))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CuratorShow);
