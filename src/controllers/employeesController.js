import { connectDB } from '../utils/connectDB.js';

export const createEmployee = async (req, res) => {
  const {
    name,
    jobTitle,
    email,
    phone,
    address,
    city,
    state,
    primary_emergency_contact_name,
    primary_emergency_contact_relationship,
    primary_emergency_contact_phone,
    secondary_emergency_contact_name,
    secondary_emergency_contact_relationship,
    secondary_emergency_contact_phone,
  } = req.body;

  try {
    const connection = await connectDB();

    // Insert employee details into the database
    const [employeeResult] = await connection
      .promise()
      .query('INSERT INTO employees (name, jobTitle, address, city, state) VALUES (?, ?, ?, ?, ?)', [
        name,
        jobTitle,
        address,
        city,
        state,
      ]);
    const employeeId = employeeResult.insertId;

    // Insert contact details into the database
    await connection
      .promise()
      .query(
        'INSERT INTO contact_details (employee_id, email, phone, primary_emergency_contact_name, primary_emergency_contact_relationship,   primary_emergency_contact_phone, secondary_emergency_contact_name, secondary_emergency_contact_relationship, secondary_emergency_contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)',
        [
          employeeId,
          email,
          phone,
          primary_emergency_contact_name,
          primary_emergency_contact_relationship,
          primary_emergency_contact_phone,
          secondary_emergency_contact_name,
          secondary_emergency_contact_relationship,
          secondary_emergency_contact_phone,
        ]
      );

    connection.end();

    return res.status(201).json({
      message: 'Employee created successfully',
      data: {
        id: employeeId,
      },
    });
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err.message);
  }
};

export const listEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const connection = await connectDB();

    // Fetch employees from the database with pagination
    const [results] = await connection.promise().query('SELECT * FROM employees LIMIT ? OFFSET ?', [limit, offset]);

    // Fetch total count of employees
    const [totalCountResults] = await connection.promise().query('SELECT COUNT(*) AS totalCount FROM employees');

    const totalCount = totalCountResults[0].totalCount;

    connection.end();

    res.header('Access-Control-Expose-Headers', 'X-Total-Count');
    res.setHeader('X-Total-Count', totalCount);

    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? `${req.originalUrl.split('?')[0]}?page=${page + 1}&limit=${limit}` : null;
    const prevPage = page > 1 ? `${req.originalUrl.split('?')[0]}?page=${page - 1}&limit=${limit}` : null;

    return res.status(200).json({
      data: results,
      meta: {
        totalCount,
        totalPages,
        nextPage,
        prevPage,
      },
    });
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err.message);
  }
};

export const updateEmployee = async (req, res) => {
  const employeeId = req.params.id;

  const {
    name,
    jobTitle,
    email,
    phone,
    address,
    city,
    state,
    primary_emergency_contact_name,
    primary_emergency_contact_relationship,
    primary_emergency_contact_phone,
    secondary_emergency_contact_name,
    secondary_emergency_contact_relationship,
    secondary_emergency_contact_phone,
  } = req.body;

  try {
    const connection = await connectDB();

    // Check if employee exists
    const [employeeResults] = await connection.promise().query('SELECT * FROM employees WHERE id = ?', [employeeId]);
    if (employeeResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Update employee details in the database
    await connection
      .promise()
      .query('UPDATE employees SET name = ?, jobTitle = ?, address = ?, city = ?, state = ? WHERE id = ?', [
        name,
        jobTitle,
        address,
        city,
        state,
        employeeId,
      ]);

    // Update contact details in the database
    await connection
      .promise()
      .query(
        'UPDATE contact_details SET email = ?, phone = ?, primary_emergency_contact_name = ?, primary_emergency_contact_relationship = ?, primary_emergency_contact_phone = ?,   secondary_emergency_contact_name = ?, secondary_emergency_contact_relationship = ?, secondary_emergency_contact_phone = ? WHERE employee_id = ?',
        [
          email,
          phone,
          primary_emergency_contact_name,
          primary_emergency_contact_relationship,
          primary_emergency_contact_phone,
          secondary_emergency_contact_name,
          secondary_emergency_contact_relationship,
          secondary_emergency_contact_phone,
          employeeId,
        ]
      );

    connection.end();

    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err.message);
  }
};

export const deleteEmployee = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const connection = await connectDB();

    // Check if employee exists
    const [employeeResults] = await connection.promise().query('SELECT * FROM employees WHERE id = ?', [employeeId]);
    if (employeeResults.length === 0) {
      connection.end();
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Delete employee from the database
    connection.query('DELETE FROM employees WHERE id = ?', [employeeId]);

    connection.end();

    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err.message);
  }
};

export const getEmployee = async (req, res) => {
  const employeeId = req.params.id;

  try {
    const connection = await connectDB();

    // Fetch employee details from the database
    const [employeeResults] = await connection.promise().execute('SELECT * FROM employees WHERE id = ?', [employeeId]);
    const [contactResults] = await connection
      .promise()
      .execute('SELECT * FROM contact_details WHERE employee_id = ?', [employeeId]);

    connection.end();

    if (employeeResults.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      const employee = { ...employeeResults[0], contactDetails: contactResults[0] };
      res.status(200).json({ data: employee });
    }
  } catch (err) {
    res.status(500).send('Internal Server Error');
    console.error(err.message);
  }
};
