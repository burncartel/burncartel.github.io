import { feedConstants } from '../actions/feed_actions';
const initialState = {
	tracks: {},
	filters: {
		sort: 'influential'
	},
	trackIdx: 0,
	trackId: -1,
	loadingFeed: false
};
// consider doing obejct for tracks...
// with trackId: {trackObj..} structure instead

const FeedReducer = (state = initialState, action) => {
	switch(action.type) {
		case feedConstants.RECEIVE_TRACKS:
			const newTracks = {};
			action.tracks.forEach((track) => {
				newTracks[track.id] = track;
			});
			return Object.assign({}, state, { tracks: newTracks });
		case feedConstants.UPDATE_FILTERS:
			const newFilters = { ...state.filters, ...action.filters } ;
			const newState = { ...state, filters: newFilters };
			return newState;
		case feedConstants.UPDATE_TRACK_ID:
			return Object.assign({}, state, { trackId: action.trackId });
		case feedConstants.LOADING_START:
			return { ...state, loadingFeed: true };
		case feedConstants.LOADING_STOP:
			return { ...state, loadingFeed: false };
		default:
			return state;
	}
};

export default FeedReducer;
