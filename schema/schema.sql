CREATE TABLE Drivers(
	uid			serial,
	name		varchar(30),
	email		varchar(30),
	phone		integer,
	home_addr	varchar(50),
	rating		real,
	dob			integer,
	tlc_num		integer,
	lic_num		integer,
	PRIMARY KEY (uid),
	UNIQUE (email));

CREATE TABLE Passengers(
	uid 		serial,
	name 		varchar(30),
	email 		varchar(30),
	phone 		integer,
	rating 		real,
	trips_taken	integer,
	PRIMARY KEY (uid),
	UNIQUE (email));

CREATE TABLE Addresses(
	uid 		integer,
	street1 	varchar(20),
	street2 	varchar(20),
	city 		varchar(20),
	state 		varchar(2),
	label 		varchar(20),
	zip 		integer,
	PRIMARY KEY (uid,label),
	FOREIGN KEY (uid) REFERENCES Passengers ON DELETE CASCADE);

CREATE TABLE Vehicle_class(
	cname 			varchar(20),
	hourly_rate		real,
	mileage_rate	real,
	PRIMARY KEY (cname));

CREATE TABLE Vehicles(
	plate_no 	varchar(20),
	make 		varchar(20),
	model 		varchar(20),
	capacity 	integer,
	cname 		varchar(20) NOT NULL,
	uid 		integer NOT NULL,
	PRIMARY KEY (plate_no),
	FOREIGN KEY (uid) REFERENCES Drivers ON DELETE CASCADE,
	FOREIGN KEY (cname) REFERENCES Vehicle_class);


CREATE TABLE Trips(
	tid 		serial,
	date 		date,
	time 		time,
	distance 	real,
	status 		varchar(20),
	type 		varchar(20),
	est_amount 	real,
	pick_addr 	varchar(100),
	drop_addr 	varchar(100),
	driver 		integer NOT NULL,
	passenger 	integer NOT NULL,
	PRIMARY KEY (tid),
	FOREIGN KEY (driver) REFERENCES Drivers (uid),
	FOREIGN KEY (passenger) REFERENCES Passengers (uid));

CREATE TABLE Transactions(
	tran_id 	varchar(200),
	pay_type 	varchar(20),
	auth_id 	integer,
	date_time	timestamp NOT NULL DEFAULT NOW(),
	amt_charged	real,
	tid 		integer NOT NULL,
	PRIMARY KEY (tran_id),
	FOREIGN KEY (tid) REFERENCES Trips (tid),
	UNIQUE(tid));
