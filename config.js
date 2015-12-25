module.exports = {
  // Whether the invite automator is running, set to false to disable registrations and change the homepage back to default
  enabled: false,

  // your community or team name to display on join page.
  community: 'COMMUNITY-NAME',

  // your slack team url (ex: socketio.slack.com)
  slackUrl: 'SLACK-TEAM-URL',

  // Access token for your slack group. you can generate at https://api.slack.com/web#auth
  // You should generate the token in admin user, not owner.
  // If you generate the token in owner user, missing_scope error will be occurred.
  slacktoken: 'SLACK-ACCESS-TOKEN',

  // If you have a bot in your chat, you can use this along with CHANNEL so that the bot will post
  //  a message whenever someone gets invited to your channel.
  // This doesn't have to be a bots token, you can use your own token if you wish to post as yourself.
  bottoken: null, // 'xxxxx'

  // Channel to post the messages of invites too.
  channel: null, // 'xxxxx'

  // Optional token (password) that must be entered in order for people to get invited
  inviteToken: null, // 'xxxxx'

  // Subheading (message) displayed while enabled == false;
  disabledMessage: 'Same bat time, same bat channel'
};
