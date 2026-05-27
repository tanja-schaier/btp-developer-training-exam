namespace exam.logistics;

type TransportMode : String enum {
  A = 'Air';
  S = 'Sea';
  R = 'Rail';
}

entity Shipments {
      // key ID : String; //TODO figure out if this is wanted or UUID
  key ID                  : UUID;
      customer            : String;
      mode                : TransportMode;
      virtual totalWeight : Decimal(10, 2);
      virtual shippingFee : Decimal(10, 2);
      packages            : Composition of many Packages
                              on packages.parent = $self;
}

entity Packages {
      // key ID : String;
  key ID       : UUID;
      contents : String;
      weight   : Decimal(10, 2);
      parent   : Association to Shipments;
}
