import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';

class App extends Component {
  constructor(){
    super()
    this.state={
      room:'',
      username: '',
      message: '',
      messages:['hello', 'test'],
      userTyping: false,
      userTypingName: ''
    }
  }

  componentDidMount(){
    this.setSocketListeners()
  }
  
  setSocketListeners = () => {
    this.socket = io()

    this.socket.on("msg", (message) => {
      console.log(message)
      let messages = this.state.messages
      messages.push(message)
      this.setState({messages})
    })

    this.socket.on("someoneIsTyping", (username) => {
      this.setState({userTypingName: username, userTyping: true})
    })

    this.socket.on("doneTyping", () => {
      this.setState({userTypingName:'', userTyping: false})
    })
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  joinRoom = () => {
    this.socket.emit("joinRoom", this.state.room)
  }

  sendMessage = () => {
    this.socket.emit("msg", {message:this.state.message, room:this.state.room})
    this.socket.emit("doneTyping", this.state.room)
    this.setState({message:''})
  }

  typingMessage = (e) => {
    this.setState({message:e.target.value})
    this.socket.emit("someoneIsTyping", {username:this.state.username, room:this.state.room})
  }

  render() {
    const messages = this.state.messages.map((msg)=> {
      return(
        <p>{msg}</p>
      )
    })
    return (
      <div className="App">
        {messages}
        <input onChange={(e)=>this.setState({room: e.target.value})} placeholder="room"/>
        <input onChange={(e)=>this.setState({username: e.target.value})} placeholder="username"/>
        <button onClick={this.joinRoom}>Join Room</button>
        <input value={this.state.message} onChange={this.typingMessage} placeholder="message"/>
        <button onClick={this.sendMessage}>Send Message</button>
        <br/>
        {this.state.userTyping && <p>{this.state.userTypingName} is Typing</p>}
      </div>
    );
  }
}

export default App;