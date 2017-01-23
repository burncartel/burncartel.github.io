import { feedConstants, receiveTracks } from '../actions/feed_actions';
import { getTracks } from '../util/bc_api';

const FeedMiddleware = ({ getState, dispatch }) => next => action => {
	switch(action.type) {

		case feedConstants.FETCH_TRACKS:
			getTracks(action.filters, (tracks) => {
				dispatch(receiveTracks(tracks));
			}, (error) => {
				// make error reducer here
				console.log(`fucekd up n got ${error}`);
			});
			return next(action);
		default:
			return next(action);
	}
};

export default FeedMiddleware;
