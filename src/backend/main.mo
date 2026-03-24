import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type PreBooking = {
    name : Text;
    phone : Text;
    email : Text;
    orderInterest : Text;
    timestamp : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module PreBooking {
    public func compare(booking1 : PreBooking, booking2 : PreBooking) : Order.Order {
      Int.compare(booking1.timestamp, booking2.timestamp);
    };
  };

  // State
  let bookingsMap = Map.empty<Int, PreBooking>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Submit pre-booking (no authentication required - anyone including guests can submit)
  public shared ({ caller }) func submitPreBooking(name : Text, phone : Text, email : Text, orderInterest : Text) : async () {
    let timestamp = Time.now();
    let booking : PreBooking = {
      name;
      phone;
      email;
      orderInterest;
      timestamp;
    };

    bookingsMap.add(timestamp, booking);
  };

  // Get all bookings (admin only)
  public query ({ caller }) func getAllBookings() : async [PreBooking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookingsMap.values().toArray().sort();
  };

  // Delete all bookings (admin only)
  public shared ({ caller }) func clearAllBookings() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear bookings");
    };

    bookingsMap.clear();
  };
};
