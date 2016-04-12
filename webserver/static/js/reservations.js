/** @jsx React.DOM */
var Reservations = React.createClass({
  getInitialState: function() {
    var user_id = this.getURLParameter('id');
    return {
      userid: user_id,
      trip_id: null,
      rating: null,
      message: null,
      message2: null,
      message3: null,
      message4: null,
      ctrip: null,
      curr: null,
      past: null
    };
  },

  getURLParameter: function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
  },

  handleChange1: function(event) {
    this.setState({ctrip: event.target.value});
  },

  handleChange2: function(event) {
    this.setState({trip_id: event.target.value});
  },
  handleChange3: function(event) {
    this.setState({rating: event.target.value});
  },

  getCurrent: function(){
    $.ajax({
      url: '/get-current?id=' + this.state.userid,
      dataType: 'json',
      success: function(data) {
        this.setState({curr: data.data.reservations});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({message: 'Could not get reservations.'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  componentDidMount(){
    var current = this.getCurrent();
    var past = this.getPast();
  },

  handleRating: function(){
    var trip_id = this.state.trip_id;
    var url = '/assign-rating?userid='+this.state.userid+'&tripid='+trip_id+'&rating='+this.state.rating;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        this.getPast();
        this.setState({message3: 'Assigned.'});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({message3: 'Could not assign rating.'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  handleCancel: function(){
    var trip_id = this.state.ctrip;
    Date.prototype.addHours= function(h){
      this.setHours(this.getHours()+h);
      return this;
    }
    var time = null;
    var date = null
    this.state.curr.map(function(item){
      if (item[7] == trip_id){
        date = item[0];
        time = item[1];
      }
    });
    var today = new Date();
    if(Date.parse(new Date().addHours(6)) > Date.parse(date + ' '+ time)){
      this.setState({message4: 'You can only cancel before 6 hours of reservation time.'});
      return;
    }
    var url = '/cancel-trip?userid='+this.state.userid+'&tripid='+this.state.ctrip;
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        if(data.data.error == 0){
          this.getCurrent();
          this.setState({message4: 'Cancelled.'});
        }
        else{
          this.setState({message4: data.data.message});
        }
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({message4: 'Could not Cancel.'})
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getPast: function(){
    $.ajax({
      url: '/get-past?id=' + this.state.userid,
      dataType: 'json',
      success: function(data) {
        this.setState({past: data.data.reservations});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({message: 'Could not get reservations.'})
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
    var user_id = this.state.userid;
    console.log(this.state.curr);
    if(user_id == null){
      return (
        <div>
          <h3>Please go to the Home page and Enter userid.</h3>
          
        </div>
      );
    }
    return (
      <div>
        <h1>Current Reservations</h1>
        <h3>Cancel</h3>
          <form className="form-inline">
            <div className="form-group">
              <label style={divStyle}>Trip id</label>
              <input type="text" className="form-control" style={divStyle} onChange={this.handleChange1} id="exampleInputName6" placeholder="123" value={this.state.ctrip}/>
            </div>
            <button type="button" onClick={this.handleCancel} className="btn btn-default" style={divStyle}>Cancel</button>
          </form>
          <h3 style={messageStyle}>{this.state.message4}</h3>
        <table className="table table-bordered">
        <thead>
        <tr><td>Date</td><td>Time</td><td>Type</td><td>Distance/Hours</td><td>Pickup</td><td>Dropoff</td><td>$ Amount</td><td>Trip id</td><td>Driver Name</td><td>Driver Phone</td></tr></thead>
        <tbody>
        { this.state.curr == null ? <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr> :
          this.state.curr.map(function(item,index) {
            return (
            <tr key={index}>
              {item.map(function(col, j) {
                return <td key={j}>{col}</td>;
              })}
            </tr>
            );
          })
        }
        </tbody>
        </table>
        <h1>Past Reservations</h1>
        <h3>Give Ratings</h3>
          <form className="form-inline">
            <div className="form-group">
              <label style={divStyle}>Trip id</label>
              <input type="text" className="form-control" style={divStyle} onChange={this.handleChange2} id="exampleInputName2" placeholder="123" value={this.state.trip_id}/>
            </div>
            <div className="form-group">
              <label style={divStyle}>Rating</label>
              <input type="email" className="form-control" style={divStyle} onChange={this.handleChange3} id="exampleInputEmail2" placeholder="5.0" value={this.state.rating}/>
            </div>
            <button type="button" onClick={this.handleRating} className="btn btn-default" style={divStyle}>Assign</button>
          </form>
          <h3 style={messageStyle}>{this.state.message3}</h3>
        <table className="table table-bordered">
        <thead>
        <tr><td>Date</td><td>Time</td><td>Type</td><td>Distance/Hours</td><td>Pickup</td><td>Dropoff</td><td>$ Amount</td><td>Trip id</td><td>Rating</td></tr></thead>
        <tbody>
        { this.state.past == null ? <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr> :
          this.state.past.map(function(item,index) {
            return (
            <tr key={index}>
              {item.map(function(col, j) {
                return <td key={j}>{col}</td>;
              })}
            </tr>
            );
          })
        }
        </tbody>
        </table>
      </div>
    );
  }
});

React.render(<Reservations />, document.getElementById('reservations'));