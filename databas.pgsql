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

