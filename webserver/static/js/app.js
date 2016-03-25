/** @jsx React.DOM */

var GoogleAPI = React.createClass({
  getInitialState: function() {
    return {
      items: '',
      key: 'AIzaSyDHOqzhoqG4uUPgI62szNJ9S2PslgVC2DM',
      list: ['908','1303','2565','4071']
    };
  },

  componentWillMount: function() {
    console.log('Helloworld');
  },

  render: function() {
    return (
      <div>
        <h1>Hello</h1>
      </div>
    );
  }
});

React.render(<GoogleAPI />, document.getElementById('googleapi'));