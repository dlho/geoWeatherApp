import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {ActivityIndicator , Colors} from 'react-native-paper';

import { API_KEY } from './utils/WeatherApiKey';

import Weather from './components/Weather';

export default class App extends React.Component {
	state = {
		isLoading: false,
		temperature: 0,
		weatherCondition: null,
		city: null,
		error: null
	};

	componentDidMount() {
		navigator.geolocation.getCurrentPosition(
			position => {
				this.fetchWeather(position.coords.latitude, position.coords.longitude);
			},
			error => {
				this.setState({
					error: 'Error Gettig Weather Condtions'
				});
			}
		);
	}

	fetchWeather(lat = 25, lon = 25) {
		fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
			.then(res => res.json())
			.then(json => {
				//console.log(json);
				this.setState({
					temperature: Math.round(json.main.temp),
					weatherCondition: json.weather[0].main,
					city: json.name,
					isLoading: false
				});
			});
	}

	render() {
		//console.log('App(render)', this.state.weatherCondition, this.state.temperature, this.state.city);
		const { isLoading } = this.state;
		if(this.state.city === null) {
			return(<ActivityIndicator style={styles.Indicator} animating={true} color={Colors.white800} size="large"/>);
		} else {
			return (
				<View style={styles.container}>
					{isLoading ? <Text>Fetching The Weather</Text> : <Weather weather={this.state.weatherCondition} temperature={this.state.temperature} city={this.state.city}/> } 
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	Indicator:{
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
});
