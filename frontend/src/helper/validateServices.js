const validateField = (value, schema) => {
  const { error } = schema.validate(value);
  return error ? error.message : "";
};

const validateForm = (data, schema) => {
  let errors = {};
  for (let name in schema) {
    const { error } = schema[name].validate(data[name]);

    if (error) errors[name] = error.message;
    else delete errors[name];
  }

  if (Object.entries(errors).length === 0) {
    return null;
  } else {
    return errors;
  }
};

const validateServices = { validateField, validateForm };
export default validateServices;
