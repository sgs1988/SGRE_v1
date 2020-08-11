
const handleRequest = async (action: any): Promise<any> => {
	const config = action;
	const url = config.internalRequest
		? `${window.location.origin}/${config.path}`
		//: "https://wadevdvlgenspawe01-webapi.azurewebsites.net/api/v1" + config.path;
		: "http://localhost:51780/api/v1" + config.path;
	
	const method = config.method || (config.body ? 'POST' : 'GET');
	let headers;
	if (!config.headers) {
		headers = new Headers({ 'Content-Type': 'application/json' });
	} else if (!config.headers['Content-Type']) {
		headers = new Headers(
			Object.assign({}, config.headers, {
				'Content-Type': 'application/json'
			})
		);
	} else {
		headers = new Headers(config.headers);
	}

	const tokenNotRequired = config.tokenNotRequired ? config.tokenNotRequired : false;
	if (!tokenNotRequired) {
		//const token = await getToken();
		//headers.append('Authorization', `Bearer ${token}`);
	}

	const body = config.body;
	const successHandler = config.success;
	const failureHandler = config.failure;
	const requestParameters: RequestInit = {
		method,
		headers,
		body: JSON.stringify(body),
		cache: 'no-cache'
	};
	const failure = (response: any) => {
		if (failureHandler) {
			failureHandler(response);
		}
		if (!config.customErrorMessage) {
			// ErrorState.error.showPageError = true;
			// ErrorState.error.errorMessage = 'Something went wrong';
		}
	};
	return fetch(url, requestParameters)
		.then((response) => {
			if (response.status === 401 || response.status === 403 ||
				response.status === 400 || response.status === 500 || response.status === 404) {
				failure(response);
				return;
			}
			const contentType = response.headers.get('content-type');
			const callSuccessHandler = (data: any) => {
				if (successHandler) {
					if (Array.isArray(successHandler)) {
						successHandler.forEach((item) => {
							item(data);
						});
					} else {
						successHandler(data);
					}
				}
			};

			if (contentType && contentType.indexOf('application/json') !== -1) {
				return response.json().then((json) => {
					const jsonString = JSON.stringify(json);
				//	const unescapedJsonString = validationHelper.unescapeString(jsonString);
					const unescapedJson = JSON.parse(jsonString);
					// process your JSON data further
					callSuccessHandler(unescapedJson);
					return unescapedJson;
				});
			} else {
				return response.text().then((text) => {
					// this is text, do something with it
					//const unescapedText = validationHelper.unescapeString(text);
					callSuccessHandler(text);
					return text;
				});
			}
		})
		.catch((error) => {
			// ErrorState.error.showPageError = true;
			// ErrorState.error.errorMessage = 'Something went wrong';
		});
};

export default handleRequest;
