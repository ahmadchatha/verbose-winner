CREATE TABLE Drivers(
	uid CHAR(20),
	name CHAR(30),
	email CHAR(30),
	phone INTEGER,
	home_addr CHAR(50),
	rating REAL,
	dob INTEGER,
	tlc_num INTEGER,
	lic_num INTEGER,
	PRIMARY KEY (uid),
	UNIQUE (email, tlc_number));

CREATE TABLE Passengers(
	uid CHAR(20),
	name CHAR(30),
	email CHAR(30),
	phone INTEGER,
	rating REAL,
	trips_taken INTEGER,
	PRIMARY KEY (uid),
	UNIQUE (email));

CREATE TABLE Addresses(
	uid CHAR(20),
	street1 CHAR(20),
	street2 CHAR(20),
	city CHAR(20),
	state CHAR(2),
	label CHAR(20),
	zip INTEGER,
	PRIMARY KEY (uid,label),
	FOREIGN KEY (uid) REFERENCES Passengers ON DELETE CASCADE);

CREATE TABLE Vehicles(
	plate_no CHAR(20),
	make CHAR(20),
	model CHAR(20),
	capacity INTEGER,
	cname CHAR(20) NOT NULL,
	uid CHAR(20) NOT NULL,
	PRIMARY KEY (plate_no),
	FOREIGN KEY (uid) REFERENCES Drivers ON DELETE CASCADE,
	FOREIGN KEY (cname) REFERENCES Vehicle_class);

CREATE TABLE Vehicle_class(
	cname CHAR(20),
	hourly_rate REAL,
	mileage_rate REAL,
	PRIMARY KEY (cname));


CREATE TABLE Trips(
	tid INTEGER,
	date DATE,
	time TIME,
	distance REAL,
	status CHAR(20),
	type CHAR(20),
	est_amount REAL,
	pick_addr CHAR(100),
	drop_addr CHAR(100),
	driver CHAR(20) NOT NULL,
	passenger CHAR(20) NOT NULL,
	PRIMARY KEY (tid),
	FOREIGN KEY (driver) REFERENCES Drivers (uid),
	FOREIGN KEY (passenger) REFERENCES Passengers (uid));

CREATE TABLE Transactions(
	tran_id CHAR(200),
	pay_type CHAR(20),
	auth_id INTEGER,
	time TIME,
	date DATE,
	amt_charged REAL,
	tid INTEGER NOT NULL,
	PRIMARY KEY (tran_id),
	FOREIGN KEY (tid) REFERENCES Trips (tid),
	UNIQUE(tid));
