/*
Tolerant Lambda handler for PUT /alergias/{...}
- Extracts id from event.pathParameters.idAlergia or .id or from last segment of event.path
- Parses event.body whether JSON string or object
- Uses mysql2/promise to run a parameterized UPDATE using a whitelist of allowed fields
- Returns JSON with affectedRows and updated id on success

Deploy: replace your current update handler with this (or merge logic), install mysql2 in the Lambda layer or package.
*/

const mysql = require('mysql2/promise');

// Replace with your connection config or pick from environment variables
const DB_CFG = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const ALLOWED_FIELDS = ['nombre', 'descripcion'];

exports.handler = async (event, context) => {
  console.log('Event:', JSON.stringify(event));

  try {
    // robust id extraction
    let id = undefined;
    if (event.pathParameters) {
      id = event.pathParameters.idAlergia || event.pathParameters.id || event.pathParameters.proxy;
    }
    if (!id && event.path) {
      // last path segment fallback
      try {
        const parts = event.path.split('/').filter(Boolean);
        id = parts.length ? parts[parts.length - 1] : undefined;
      } catch (e) {
        // ignore
      }
    }

    if (!id) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Falta idAlergia en path' }),
      };
    }

    // parse body robustly
    let body = event.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { /* leave as string */ }
    }

    if (!body || typeof body !== 'object') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Request body JSON esperado' }),
      };
    }

    // build whitelist SET clause
    const updates = [];
    const params = [];
    for (const key of ALLOWED_FIELDS) {
      if (typeof body[key] !== 'undefined') {
        updates.push(`${key} = ?`);
        params.push(body[key]);
      }
    }

    if (updates.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'No hay campos permitidos para actualizar' }),
      };
    }

    params.push(id); // for WHERE

    const sql = `UPDATE Alergia SET ${updates.join(', ')} WHERE idAlergia = ?`;

    const conn = await mysql.createConnection(DB_CFG);
    try {
      const [result] = await conn.execute(sql, params);
      console.log('Update result', result);

      if (result.affectedRows > 0) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ affectedRows: result.affectedRows, idAlergia: Number(id) }),
        };
      } else {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Registro no encontrado', affectedRows: 0, idAlergia: Number(id) }),
        };
      }
    } finally {
      await conn.end();
    }

  } catch (err) {
    console.error('Handler error', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Internal error', error: err && err.message }),
    };
  }
};
