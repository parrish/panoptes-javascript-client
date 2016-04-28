var config = require('./config');
var JSONAPIClient = require('json-api-client');
var makeHTTPRequest = JSONAPIClient.makeHTTPRequest;

statsClient = {
  projectId: null,
  workflowId: null,
  
  update: function (options) {
    var keys = Object.keys(options);
    for (var i in keys) {
      this[keys[i]] = options[keys[i]];
    }
    return this
  },

  statCount: function (period, type) {
    var query = this.workflowId ? "workflow_id=" + this.workflowId : "project_id=" + this.projectId;
    var stats_url = [config.statHost, 'counts', type, period].join('/') + '?' + query;
    return makeHTTPRequest('GET', stats_url)
        .then(
          function (response) {
            var results = JSON.parse(response.text);
            return results["events_over_time"]["buckets"]
          }
        )
        .catch(
          function (response) {
            console.error( 'Failed to get stats' );
          }
        )
  }
}

module.exports = statsClient;
