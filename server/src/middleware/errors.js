function notFound(req, res) {
  res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: `Photo is too large. Maximum is ${process.env.MAX_UPLOAD_MB || 5} MB.` });
  }
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'That entry already exists. Change the name or web address and save again.' });
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ error: 'This item is still used elsewhere (for example a province with congregations). Remove those first.' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Something went wrong on the server. Try again.' : err.message });
}

module.exports = { notFound, errorHandler };
