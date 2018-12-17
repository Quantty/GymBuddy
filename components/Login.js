import React from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import Auth0 from 'react-native-auth0';
import SInfo from 'react-native-sensitive-info';
import RNRestart from 'react-native-restart';
import config from '../config';

const auth0 = new Auth0({
  domain: config.AUTH0_DOMAIN,
  clientId: config.AUTH0_CLIENT_ID
});

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasInitialized: false
    }
  }

  componentDidMount() {
    SInfo.getItem('accessToken', {}).then(accessToken => {
      if (accessToken) {
        auth0.auth
          .userInfo({ token: accessToken })
          .then(data => {
            this.gotoApplication(data);
          })
          .catch(err => {
            SInfo.getItem('refreshToken', {}).then(refreshToken => {
              auth0.auth
                .refreshToken({ refreshToken })
                .then(newAccessToken => {
                  SInfo.setItem('accessToken', newAccessToken);
                  // RNRestart.Restart();
                })
                .catch(err2 => {
                  console.log(err2);
                });
            });
          });
      } else {
        this.setState({
          hasInitialized: true
        });
      }
    });
  }

  render() {
    return (
      <View>
        <ActivityIndicator
          size="large"
          color="#05a5d1"
          animating={!this.state.hasInitialized}
        />
        {
          this.state.hasInitialized &&
            <Button onPress={this.login} title="Login" />    
        }
      </View>
    );
  }

  login = () => {
    auth0.webAuth
      .authorize({
        scope: config.AUTHO_SCOPE,
        audience: config.AUTH0_AUDIENCE,
        prompt: "login"
      })
      .then(res => {
        auth0.auth
          .userInfo({ token: res.accessToken })
          .then(data => {
            this.gotoAccount();
          })
          .catch(err => {
            console.log(JSON.stringify(err));
          });

        SInfo.setItem("accessToken", res.accessToken, {});
        SInfo.setItem("refreshToken", res.refreshToken, {});
      })
      .catch(error => {
        console.log(error);
      });
  };

  gotoApplication = () => {
    this.setState({
      hasInitialized: true
    });
    this.props.navigation.navigate('Application');
  }
}