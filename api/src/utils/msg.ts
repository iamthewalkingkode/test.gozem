const msg = {
    oneOf: (f: string, options: string[]) => `${f} must be one of the following values: ${options.join(', ')}`,
    uuid: (f: string) => `${f} must be a valid UUID`,
    email: (f: string) => `${f} must be a valid email`,
    string: (f: string) => `${f} must be a string`,
    added: (f: string) => `${f} added successfully`,
    array: (f: string) => `${f} must be an array`,
    object: (f: string) => `${f} must be an object`,
    unique: (f: string) => `Sorry, ${f} has already been used`,
    number: (f: string) => `${f} must be a number`,
    matches: (f: string, format: string) => `${f} must follow the following format: ${format}`,
    updated: (f: string) => `${f} updated successfully`,
    deleted: (f: string) => `${f} deleted successfully`,
    password: () => `password must be at least 8 characters long and contain both letters (a-Z) and numbers (0-9)`,
    notFound: (f: string) => `Sorry, ${f} not found`,
    required: (f: string) => `${f} is required`,
    notExists: (f: string) => `Sorry, ${f} does not exist`,
};

export default msg;