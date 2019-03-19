import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

class App extends Component {
  constructor(){
    super()
    this.state={
      room: '',
      userId:'',
      username: '',
      message: '',
      messages:['hello', 'test'],
      userTyping: false,
      userTypingName: '',
      users: [
        {
          id: 1,
          username: "Dude 1"
        },
        {
          id: 8,
          username: "Dude 2"
        },
        {
          id: 3,
          username: "Dude 3"
        },
        {
          id: 21,
          username: "Dude 4"
        }
      ]
    }
  }

  componentDidMount(){
    this.setSocketListeners()
  }
  
  setSocketListeners = () => {
    this.socket = io()

    this.socket.on('sendMsg', (msg) => {
      let messages = this.state.messages
      messages.push(msg)
      this.setState({messages})
    })
  }
  
  login = () => {
    alert('logged in as user ' + this.state.userId)
  }

  sendMessage = () => {
    this.socket.emit('sendMsg', {room:this.state.room, msg:this.state.message})
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  joinChatRoom = (myId, friendId) => {
    this.socket.emit('leaveRoom', this.state.room)
    myId = parseInt(myId)
    friendId = parseInt(friendId)
    let highUser
    let lowUser
    if(myId > friendId){
      highUser = myId
      lowUser = friendId
    } else {
      highUser = friendId
      lowUser = myId
    }
    const roomId = highUser + ':' + lowUser
    console.log(roomId)
    this.setState({room:roomId})
    this.socket.emit('joinRoom', roomId)
  }

  render() {
    console.log(this.state)
    const friends = this.state.users.map((user, i) => {
      return (
        <p onClick={() => this.joinChatRoom(this.state.userId, user.id)}>Chat with {user.username}</p>
      )
    })
    const messages = this.state.messages.map((msg)=> {
      return(
        <p>{msg}</p>
      )
    })
    return (
      <div className="App">
        {messages}
        <input onChange={(e)=>this.setState({userId: e.target.value})} placeholder="id"/>
        <input onChange={(e)=>this.setState({username: e.target.value})} placeholder="username"/>
        <button onClick={this.login}>Login</button>
        <input value={this.state.message} onChange={(e) => this.setState({message: e.target.value})} placeholder="message"/>
        <button onClick={this.sendMessage}>Send Message</button>
        <br/>
        {this.state.userTyping && <p>{this.state.userTypingName} is Typing</p>}
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        {friends}
      </div>
    );
  }
}

export default App;
