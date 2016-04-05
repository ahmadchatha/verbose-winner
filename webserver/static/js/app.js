/** @jsx React.DOM */

var GoogleAPI = React.createClass({
  getInitialState: function() {
    return {
      userid: null,
      name: null,
      email: null,
      phone: null
    };
  },

  getURLParameter: function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
  },

  handleChange: function(event) {
    this.setState({userid: event.target.value});
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
          <h1>OR</h1>
          <h3>Enter User details</h3>
          <form className="form-inline">
            <div className="form-group">
              <label style={divStyle}>Name</label>
              <input type="text" className="form-control" style={divStyle} id="exampleInputName2" placeholder="Jane Doe"/>
            </div>
            <div className="form-group">
              <label style={divStyle}>Email</label>
              <input type="email" className="form-control" style={divStyle} id="exampleInputEmail2" placeholder="jane.doe@example.com"/>
            </div>
            <div className="form-group">
              <label style={divStyle}>Phone</label>
              <input type="email" className="form-control" style={divStyle} id="exampleInputEmail2" placeholder="1234567890"/>
            </div>
            <button type="button" className="btn btn-default" style={divStyle}>Create</button>
          </form>
        </div>
      );
    }
    return (
      <div>
        <h1>We are all set.</h1>
      </div>
    );
  }
});

React.render(<GoogleAPI />, document.getElementById('googleapi'));