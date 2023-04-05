create table TestTablePerson (
	person_id serial,
	f_name varchar(20),
	l_name varchar(30),
	primary key(person_id)
	);
	
create table TestTableSchema (
	schema_id serial,
	person_id int not null,
	day varchar(15) not null,
	time char (5) not null,
	booked boolean not null,
	primary key(schema_id),
	foreign key(person_id)References TestTablePerson(person_id) on update Cascade
);

insert into TestTablePerson(f_name, l_name) 
values 
('Petter', 'Carlsson'),
('Teo', 'Gefors'),
('Pelle', 'Pellesson'),
('Calle', 'Callesson'),
('Fredrik', 'Fredriksson'),
('Gustav', 'Gustavsson'),
('Erik', 'Eriksson');

create or replace procedure CreateNewTimeTable()
language plpgsql
as $$
begin
	insert into TestTableSchema(day, time, booked)
	values 
	('Monday', '09:00', FALSE),
	('Monday', '10:00', FALSE),
	('Monday', '11:00', FALSE),
	('Monday', '12:00', FALSE),
	('Tuesday', '09:00', FALSE),
	('Tuesday', '10:00', FALSE),
	('Tuesday', '11:00', FALSE),
	('Tuesday', '12:00', FALSE),
	('Wednesday', '09:00', FALSE),
	('Wednesday', '10:00', FALSE),
	('Wednesday', '11:00', FALSE),
	('Wednesday', '12:00', FALSE),
	('Thursday', '09:00', FALSE),
	('Thursday', '10:00', FALSE),
	('Thursday', '11:00', FALSE),
	('Thursday', '12:00', FALSE),
	('Friday', '09:00', FALSE),
	('Friday', '10:00', FALSE),
	('Friday', '11:00', FALSE),
	('Friday', '12:00', FALSE);
	commit;
end; $$

create table Organisation(
	org_id serial primary key,
	name varchar(60) not null,
	address varchar(100),
	email varchar(50) not null	
);

create table Person(
	per_id serial primary key,
	username varchar(50) not null,
	password varchar(30) not null,
	org_id int,
	foreign key(org_id) references Organisation(org_id)
);

create table BookingSchema(
	bok_id serial primary key,
	start_time time not null,
	end_time time not null,
	per_id int not null,
	booking_date date not null,
	foreign key(per_id) references Person(per_id)
);

CREATE OR REPLACE PROCEDURE add_organization(
    p_name VARCHAR(60),
    p_address VARCHAR(100),
    p_email VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Organisation (name, address, email)
    VALUES (p_name, p_address, p_email);
COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE add_person(
    p_username VARCHAR(50),
    p_password VARCHAR(30),
    p_org_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Person (username, password, org_id)
    VALUES (p_username, p_password, p_org_id);
COMMIT;
END;
$$;

CREATE OR REPLACE PROCEDURE add_booking(
    p_start_time TIME,
    p_end_time TIME,
    p_per_id INT,
    p_booking_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO BookingSchema (start_time, end_time, per_id, booking_date)
    VALUES (p_start_time, p_end_time, p_per_id, p_booking_date);
COMMIT;
END;
$$;
