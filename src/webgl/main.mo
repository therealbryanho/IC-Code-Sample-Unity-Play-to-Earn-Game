import Principal "mo:base/Principal";
import Buffer "mo:base/Buffer";
import Token "canister:Token";
import Bool "mo:base/Bool";

actor Main {

    public type Subaccount = Blob;
    public type Tokens = Nat;
    public type Memo = Blob;
    public type Timestamp = Nat64;
    private stable var owner_ : Principal = Principal.fromText("ikyi2-eeuen-hrt6y-zyjqn-my5fy-zi5zy-746dl-otcpi-gfqm3-zzl24-eae");

    // Get the principal owner
    public query func get() : async Principal {
        return owner_;
    };

    // Set the principal owner
    public func set(n : Principal) : async () {
        var owner : Principal = n;
        owner_ := owner;
    };

    public func transferToken({

        _from : Text;
        _to : Text;
        amount : Tokens;
    }) : async Bool {
        var from : Principal = Principal.fromText(_from);
        var to : Principal = Principal.fromText(_to);
        if (owner_ != from) {
            return false;
        };

        let from_subaccount = null;
        let fee = null;
        let memo = null;
        let created_at_time = null;

        let res = await Token.icrc1_transfer({
            from_subaccount;
            from;
            to;
            amount;
            fee;
            memo;
            created_at_time;
        });
        return true;
    };

};
