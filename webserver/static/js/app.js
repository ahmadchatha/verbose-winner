/** @jsx React.DOM */
var GoogleAPI = React.createClass({
  getInitialState: function() {
    return {
      userid: null,
      name: null,
      email: null,
      phone: null,
      message: null,
      message2: null
    };
  },

  getURLParameter: function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
  },

  handleChange: function(event) {
    this.setState({userid: event.target.value});
  },
  handleChange2: function(event) {
    this.setState({name: event.target.value});
  },
  handleChange3: function(event) {
    this.setState({email: event.target.value});
  },
  handleChange4: function(event) {
    this.setState({phone: event.target.value});
  },

  handleUser: function(){
    $.ajax({
      url: '/confirm-user?id=' + this.state.userid,
      dataType: 'json',
      success: function(data) {
        var id = data.data[0];
        if(id != null){
          window.location.href = "/?id="+id;
        }
        else{
          this.setState({message: 'Incorrect ID. Please enter a valid ID.'})
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCreate: function(){
    $.ajax({
      url: '/create-user?name=' + this.state.name + '&email='+ this.state.email + '&phone=' + this.state.phone,
      dataType: 'json',
      success: function(data) {
        console.log(data);
        if(data.data.error == 0){
          window.location.href = "/?id="+data.data.data[0];
        }
        else{
          this.setState({message2: 'There was a problem inserting the data. Make sure your email was never used before to create an account.'});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var divStyle = {
      marginLeft: '5px',
      marginRight: '5px',
      marginBottom: '5px'
    };
    var messageStyle={
      color: 'red'
    };
    var user_id = this.getURLParameter('id');
    if(user_id == null){
      return (
        <div>
          <h3>Enter User details</h3>
          <form className="form-inline">
            <div className="form-group">
              <label style={divStyle}>User ID</label>
              <input type="text" className="form-control" style={divStyle} id="userid" onChange={this.handleChange} placeholder="1" value={this.state.userid}/>
            </div>
            <button type="button" onClick={this.handleUser} className="btn btn-default" style={divStyle}>Login</button>
          </form>
          <h3 style={messageStyle}>{this.state.message}</h3>
          <h1>OR</h1>
          <h3>Create New ID</h3>
          <form className="form-inline">
            <div className="form-group">
              <label style={divStyle}>Name</label>
              <input type="text" className="form-control" style={divStyle} onChange={this.handleChange2} id="exampleInputName2" placeholder="Jane Doe" value={this.state.name}/>
            </div>
            <div className="form-group">
              <label style={divStyle}>Email</label>
              <input type="email" className="form-control" style={divStyle} onChange={this.handleChange3} id="exampleInputEmail2" placeholder="jane.doe@example.com" value={this.state.email}/>
            </div>
            <div className="form-group">
              <label style={divStyle}>Phone</label>
              <input type="email" className="form-control" style={divStyle} onChange={this.handleChange4} id="exampleInputEmail2" placeholder="1234567890" value={this.state.phone}/>
            </div>
            <button type="button" onClick={this.handleCreate} className="btn btn-default" style={divStyle}>Create</button>
          </form>
          <h3 style={messageStyle}>{this.state.message2}</h3>
        </div>
      );
    }
    return (
      <div>
        <h1>We are all set. Your User id is {user_id}</h1>
      </div>
    );
  }
});

React.render(<GoogleAPI />, document.getElementById('googleapi'));