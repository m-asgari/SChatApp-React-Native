import React from 'react';
import AsyncStorage  from  '@react-native-community/async-storage';

import { GiftedChat } from 'react-native-gifted-chat';
import PropTypes from 'prop-types'; 
import BackendFire from './BackendFire';

export default class Chat extends React.Component {
  state = {
    messages: [],
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={(message) => {
          BackendFire.sendMessage(message);
        }}
        user={{
          _id:  BackendFire.getUid(),
          name: this.props.name,
        }}
      />
    );
  }
  async componentDidMount() {
    /*
    Backend.loadMessages((message) => {
      AsyncStorage.setItem(previousState)
      .then(value => {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.append(previousState.messages, message),
          };
      })
      .done();
     });
    });
*/
 
BackendFire.loadMessages((message) => {
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, message),
        };
      });
    });
 
  }
  async componentWillUnmount() {
    BackendFire.closeChat();
  }
}

Chat.defaultProps = {
  name: 'Majid Asgari',
};

Chat.propTypes = {
  name: PropTypes.string,
};
