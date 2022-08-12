import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:4017';
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default function App() {
	const state = {
		Home: 'HOME',
		Products: 'PRODUCTs',
		Login: 'LOGIN',
		SignUp: 'SIGNUP',
		Profile: 'PROFILE',
	}

	const initialUser = {
		username: null,
		password: null,
		lastName: null,
		firstName: null,
	}

	return {
		screen: state.Home,
		user: initialUser,
		init() {
			console.log('init...');
			this.checkUser();
		},
		goto(id) {
			this.screen = id
			// (localStorage['token'])
			// ? this.checkUser()
			// : this.screen = id

		},
		authToken() {
			axios.get('/api/authenticate')
				.then(r => r.data)
				.then((data) => {
					console.log(data);
					const { status, user } = data;
					this.user = user;
					this.goto(state.Home);
				})
				.catch(err => {
					console.log({err});
					this.goto(state.Login);
				});
		},
		checkUser() {
			const token = localStorage.getItem('token');

			
			if (token) {
				// call API to validate the token
				// localStorage.setItem('token', 'wow')
				this.authToken();
				
			} else {
				this.user = initialUser;
				this.goto(state.Login);
			}

			console.log({ token });
		},
		logout() {
			localStorage.clear();
			this.checkUser();
		},
		login() {
			this.loading = true;
			axios.post('/api/login', this.user)
				.then(result => result.data)
				.then(data => {
					const { user, token } = data;
					axios.defaults.headers.common['Authorization'] = token;
					localStorage.setItem('token', token);
					localStorage.setItem('user', JSON.stringify(user));
					this.checkUser();
					this.user = user;
					this.loading = false;

				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		signUp() {
			this.loading = true;
			axios.post('/api/signup', this.user)
				.then(result => result.data)
				.then(data => {
					console.log(data);
					this.goto(state.Login);
					this.loading = false;
				})
				.catch(err => {
					console.log(err);
					this.loading = false;
				});
		},
		getProducts() {

			axios.post('/api/products', { username, password })
				.then(result => result.data)
				.then(data => {
					console.log(data);
				})
				.catch(err => console.log(err))
		},


		getProduct(id) {
			axios.post('/api/products/' + id, { username, password })
				.then(result => result.data)
				.then(data => {
					console.log(data);
				})
				.catch(err => console.log(err))
		},
	}
}
