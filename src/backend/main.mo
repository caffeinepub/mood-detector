import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Random "mo:core/Random";
import Array "mo:core/Array";

actor {
  type Mood = {
    name : Text;
    emoji : Text;
    description : Text;
  };

  module Mood {
    public func compare(mood1 : Mood, mood2 : Mood) : Order.Order {
      Text.compare(mood1.name, mood2.name);
    };
  };

  let moods : [Mood] = [
    { name = "Happy"; emoji = "😊"; description = "Feeling on top of the world!" },
    { name = "Sad"; emoji = "😢"; description = "A bit down in the dumps." },
    { name = "Excited"; emoji = "😃"; description = "Can't wait for what's next!" },
    { name = "Calm"; emoji = "😌"; description = "Zen mode activated." },
    { name = "Angry"; emoji = "😡"; description = "Fuming like a volcano!" },
    { name = "Confused"; emoji = "😕"; description = "Spinning in circles." },
    { name = "Sleepy"; emoji = "😴"; description = "Ready for a nap!" },
  ];

  public query ({ caller }) func getAllMoods() : async [Mood] {
    moods;
  };

  public shared ({ caller }) func getRandomMood() : async Mood {
    let random = Random.crypto();
    let randomIndex = await* random.natRange(0, Nat.max(0, moods.size() - 1));
    moods[randomIndex];
  };
};
