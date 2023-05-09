/**
*@author Petter Carlsson, Teo Gefors
*
*/

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

create table Organization(
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
	foreign key(org_id) references Organization(org_id)
);

create table BookingSchema(
	bok_id serial primary key,
	start_time time not null,
	end_time time not null,
	per_id int not null,
	booking_date date not null,
	foreign key(per_id) references Person(per_id)
);

create table Authentication(
	person serial not null,
	username varchar(50) not null,
	token varchar(36) primary key,
	expires timestamp not null,
	foreign key(person) references Person(per_id),
    unique(token, expires)
);

/**
 * Adds an organization to the system
 * @param p_name VARCHAR(60), the name of the organization
 * @param p_address VARCHAR(100), the address of the organization
 * @param p_email VARCHAR(50), the email of the organization
 */
CREATE OR REPLACE PROCEDURE add_organization(
    p_name VARCHAR(60),
    p_address VARCHAR(100),
    p_email VARCHAR(50)
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Organization (name, address, email)
    VALUES (p_name, p_address, p_email);
COMMIT;
END;
$$;

/**
 * Adds a person to a specific organization
 * @param p_username VARCHAR(50), the username of the person
 * @param p_password VARCHAR(30), the password of the person
 * @param p_org_id INT, the id of an organization
 */
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

/**
 * Adds a specific booking for a specific person
 * @param p_per_id INT, the id of the person
 * @param p_start_time TIME, the start time of the booking
 * @param p_end_time TIME, the end time of the booking
 * @param  p_booking_date DATE, the date of the booking
 */
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

/**
 * Removes a specific booking for a specific person
 * @param p_per_id INT, the id of the person
 * @param p_start_time TIME, the start time of the booking
 * @param p_end_time TIME, the end time of the booking
 * @param  p_booking_date DATE, the date of the booking
 */
CREATE OR REPLACE PROCEDURE remove_booking(
    p_per_id INT,
    p_start_time TIME,
    p_end_time TIME,
    p_booking_date DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM BookingSchema WHERE per_id = p_per_id AND start_time = p_start_time AND end_time = p_end_time AND booking_date = p_booking_date;
COMMIT;
END;
$$;

/**
 * Removes all bookings for a specific person
 * @param p_per_id INT, the id of the person
 */
CREATE OR REPLACE PROCEDURE remove_all_bookings_for_person(
    p_per_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM BookingSchema WHERE per_id = p_per_id;
COMMIT;
END;
$$;

/**
 * Removes a specific person from an organization
 * @param p_username VARCHAR(50), the username of a person
 * @param p_org_id INT, the org id of an organization that the person is associated with it
 */
CREATE OR REPLACE PROCEDURE remove_person(
	p_username VARCHAR(50), 
	p_org_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Person WHERE username = p_username AND org_id = p_org_id;
COMMIT;
END;
$$;

/**
 * Removes all persons associated with a specific organizations
 * @param p_org_id INT, The id of an organization
 */
CREATE OR REPLACE PROCEDURE remove_all_persons_for_org(
    p_org_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM BookingSchema
    WHERE per_id IN (SELECT per_id FROM Person WHERE org_id = p_org_id);
    DELETE FROM Person WHERE org_id = p_org_id;
COMMIT;
END;
$$;

/**
 * Removes an organization and with it all associated persons and the booked times with it
 * @param p_org_id INT, The id of an organization
 */
CREATE OR REPLACE PROCEDURE remove_org(
    p_org_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM BookingSchema
    WHERE per_id IN (SELECT per_id FROM Person WHERE org_id = p_org_id);
    DELETE FROM Person WHERE org_id = p_org_id;
    DELETE FROM Organization WHERE org_id = p_org_id;
COMMIT;
END;
$$;

/**
 * Gives all the bookings for a specific organizations
 * @author Petter Carlsson
 * @param p_org_id INT, The id of an organization
 * @returns Table, Returns a table with start time and end time of the booking as well as the date
 */
CREATE OR REPLACE FUNCTION get_booking_info_by_org_id(
	p_org_id INT
	)
RETURNS TABLE(
	start_time TIME, 
	end_time TIME, 
	booking_date DATE
	) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
        SELECT bs.start_time, bs.end_time, bs.booking_date
        FROM BookingSchema bs
        JOIN Person p ON bs.per_id = p.per_id
        WHERE p.org_id = p_org_id;
END;
$$ 

//select * from get_booking_info_by_org_id(n);
/**
 * Checks if the person is allowed to book another time
 * @author Petter Carlsson
 * @param p_id int, The id of a person
 * @returns boolean, returns true if the person has booked less that 2 times and returns
 * false when its 2 or more
 */
CREATE OR REPLACE FUNCTION check_booking_limit(
	p_id int
)
RETURNS boolean 
LANGUAGE plpgsql
AS $$
DECLARE
  booking_count int;
BEGIN
  SELECT COUNT(*) INTO booking_count FROM BookingSchema WHERE per_id = p_id;
  RETURN booking_count < 2;
END;
$$ 

//select check_booking_limit(n);
/**
 * Delets all bookings that is older than the current date
 * @author Petter Carlsson
 */
CREATE OR REPLACE FUNCTION delete_past_bookings()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM BookingSchema WHERE booking_date <= now()::date;
  RETURN NULL;
END;
$$
/**
 * Trigger that modifies that insert command into the BookingSchema that calls for the function
 * that delets all past bookings
 * @author Petter Carlsson
 */
CREATE TRIGGER delete_past_bookings_trigger
AFTER INSERT OR UPDATE ON BookingSchema
FOR EACH ROW
EXECUTE FUNCTION delete_past_bookings();
/**
 * Checks if the log in credentials are correct
 * @author Petter Carlsson
 * @param p_username varchar(50), The given username
 * @param p_password varchar(30), The given password
 * @returns boolean, returns true if there is a person that matches the given password and username
 */
CREATE OR REPLACE FUNCTION log_in(
    p_username varchar(50),
    p_password varchar(30)
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
    found_person RECORD;
BEGIN
    SELECT *
    INTO found_person
    FROM Person
    WHERE username = p_username AND password = p_password;
    
    IF found_person IS NOT NULL THEN
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$

//select log_in('5B', '123')
/**
 * Gives the person id from the log in credentials
 * @author Petter Carlsson
 * @param p_username varchar(50), The given username
 * @param p_password varchar(30), The given password
 * @returns person_id, gives the person id that the password and username matches
 */
CREATE OR REPLACE FUNCTION get_person_id(
    p_username varchar(50),
    p_password varchar(30)
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    found_person RECORD;
BEGIN
    SELECT per_id
    INTO found_person
    FROM Person
    WHERE username = p_username AND password = p_password;
    
    IF found_person IS NOT NULL THEN
        RETURN found_person.per_id;
    ELSE
        RETURN NULL;
    END IF;
END;
$$

//select get_person_id('5B', '123')

/**
 * Counts all the booked times per day of a given month and year
 * @author Petter Carlsson
 * @param year_in INT, The year that needs checked
 * @param month_in INT, The month that needs checked
 * @param org_id_in INT, The person id
 * @returns table, A table with the booking dates and the amount of times booked on those days
 */
CREATE OR REPLACE FUNCTION count_bookings(
    year_in INT, 
    month_in INT, 
    org_id_in INT
    )
RETURNS TABLE (
    booking_date DATE,
    count INT
)
AS $$
DECLARE
    start_date DATE := (year_in || '-' || month_in || '-01')::DATE;
    end_date DATE := (start_date + INTERVAL '1 MONTH')::DATE;
BEGIN
    RETURN QUERY
    SELECT bs.booking_date, COUNT(*)::INTEGER AS count
    FROM BookingSchema bs
    JOIN Person p ON bs.per_id = p.per_id
    WHERE p.org_id = org_id_in
    AND bs.booking_date >= start_date
    AND bs.booking_date < end_date
    GROUP BY bs.booking_date;
END;
$$
LANGUAGE plpgsql;

//Året, Måndaden, org_id
//select * from count_bookings(2023, 5, 2)

/**
 * Checks what times are booked on a specific date for an organization
 * @author Petter Carlsson
 * @param org_id_in INT, The id of a organization
 * @param booking_date_in DATE, The date that will be checked
 * @returns Table, A table with the person id that booked and the times for a specific date
 */
CREATE OR REPLACE FUNCTION get_booked_times_for_specific_day(
    org_id_in INT, 
    booking_date_in DATE
    )
RETURNS TABLE (
    per_id INT,
    start_time TIME,
    end_time TIME
)
AS $$
BEGIN
    RETURN QUERY
    SELECT bs.per_id, bs.start_time, bs.end_time
    FROM BookingSchema bs
    JOIN Person p ON bs.per_id = p.per_id
    WHERE p.org_id = org_id_in
    AND bs.booking_date = booking_date_in;
END;
$$
LANGUAGE plpgsql;

//Org_id och specifikt datum
//SELECT * FROM get_booked_times_for_specific_day(2, '2023-05-18');

/**
 * Books a time if there is no other time booked in that block in the organizations and if the
 * person_id doesn't have two booked times already ascocieted with it.
 * @author Petter Carlsson
 * @param in_start_time TIME, The start time of the block
 * @param in_end_time TIME, The end time of the block
 * @param in_per_id INT, The person id
 * @param in_booking_date DATE, the date of the selected block
 * @returns boolean, Returns true if everything checks out otherwise returns false
 */
CREATE OR REPLACE FUNCTION book_time(
    in_start_time TIME,
    in_end_time TIME,
    in_per_id INT,
    in_booking_date DATE
) 
RETURNS BOOLEAN AS $$
DECLARE
    conflict_count INT;
    booking_count INT;
BEGIN
    SELECT COUNT(*) INTO conflict_count FROM BookingSchema bs
    JOIN Person p ON bs.per_id = p.per_id
    JOIN Organization o ON p.org_id = o.org_id
    WHERE bs.booking_date = in_booking_date
        AND ((bs.start_time >= in_start_time AND bs.start_time < in_end_time)
            OR (bs.end_time > in_start_time AND bs.end_time <= in_end_time)
            OR (bs.start_time < in_start_time AND bs.end_time > in_end_time))
        AND (p.per_id = in_per_id OR o.org_id = (SELECT org_id FROM Person WHERE per_id = in_per_id));

    IF conflict_count = 0 THEN
        SELECT COUNT(*) INTO booking_count FROM BookingSchema WHERE per_id = in_per_id;
        IF booking_count < 2 THEN
            INSERT INTO BookingSchema(start_time, end_time, per_id, booking_date) 
			VALUES (in_start_time, in_end_time, in_per_id, in_booking_date);
            RETURN TRUE;
        ELSE
            RETURN FALSE;
        END IF;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$ 
LANGUAGE plpgsql;

//starttid, sluttid, person_id, datum
//SELECT book_time('08:00:00', '12:00:00', 7, '2023-05-26');
