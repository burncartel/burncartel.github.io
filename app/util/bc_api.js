import $ from 'jquery';

const localUrl = 'http://localhost:3000/api/v1/tracks/filter';
const devUrl = 'https://bc-fire-api.herokuapp.com/api/v1/tracks/filter';

// let url = ((location.hostname === 'localhost') ? localUrl : devUrl);

// the page number is passed in here as well



export const getFeed = (resource, filters, success = suc, error = err, page = 1) => {

	let getUrl;

	if(filters.id) {
		getUrl = `http://localhost:3000/api/v1/${resource}/${filters.id}`;
	} else {
		// we are dealing with a fire feed
		getUrl = `http://localhost:3000/api/v1/${resource}?sort_type=${filters.sortType}`;
	}


	$.ajax({
		url: getUrl,
		success,
		error
	});


};

export const getTracks = (filters, success = suc, error = err, page = 1) => {
	const baseUrl = ((location.hostname === 'localhost') ? localUrl : devUrl);

	const url = `${baseUrl}/${filters['sort']}?page=${page}`;

	$.ajax({
		url,
		method: 'GET',
		data: filters,
		success,
		error
	});

};

export const getLikes = (userId, success = suc, error = err) => {
	$.ajax({
		url: `http://localhost:3000/api/v1/users/${userId}/likes`,
		method: 'GET',
		success,
		error
	});
};
