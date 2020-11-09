import environment from './enviornment';

const port: number = environment == null ? 3000 : parseInt(environment);

export default port;
