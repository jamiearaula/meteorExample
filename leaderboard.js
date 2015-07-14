// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Mongo.Collection("players");

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return Players.find({}, { sort: { name: 1 } });
    },
    selectedName: function () {
      var player = Players.findOne(Session.get("selectedPlayer"));
      return player && player.name;
    },
    isAdmin: function(userType){
      try{
        return Meteor.user().profile.userType === userType;
      }
      catch(e){
        
      }
    }
  });

  Template.leaderboard.events({
    'click .inc': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: 5}});
    },
    'click .add-scientist': function () {
      var name = prompt("Enter the name of the scientist: ");

      if(name && (name.length!=0) ){
        Players.insert({ name: name , score: 0} );
      }

      else if(name.length == 0){
        alert("You didnt enter any scientist!!!!");
      }
    
    },
    'click .rmv': function () {
      Players.update(Session.get("selectedPlayer"), {$inc: {score: -5}});
    },
    'click .remove-player':function(){
      Players.remove(Session.get("selectedPlayer"));
    }
  });

  Template.player.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace", "Grace Hopper", "Marie Curie",
                   "Carl Friedrich Gauss", "Nikola Tesla", "Claude Shannon"];
      _.each(names, function (name) {
        Players.insert({
          name: name,
          score: Math.floor(Random.fraction() * 10) * 5
        });
      });
    }
  });
}
