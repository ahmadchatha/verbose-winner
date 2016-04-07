/** @jsx React.DOM */
var Reservations = React.createClass({
  getInitialState: function() {
    var user_id = this.getURLParameter('id');
    return {
      userid: user_id,
      message: null,
      message2: null,
      curr: null,
      past: null
    };
  },

  getURLParameter: function(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
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
        <table className="table table-bordered">
        <thead>
        <tr><td>Date</td><td>Time</td><td>Type</td><td>Distance/Hours</td><td>Pickup</td><td>Dropoff</td><td>$ Amount</td><td>Trip id</td></tr></thead>
        <tbody>
        { this.state.past == null ? <tr><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td></tr> :
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