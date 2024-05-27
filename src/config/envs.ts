import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    PRODUCTS_MICROSERVICE_HOST: string;
    PRODUCTS_MICROSERVICE_PORT: number
}

const envsSchema = joi.object({
    PORT: joi.number().required().default(3000),
    PRODUCTS_MICROSERVICE_HOST: joi.string().required(),
    PRODUCTS_MICROSERVICE_PORT: joi.number().required()

}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const envVars: EnvVars = value;

export const envs = {

    port: envVars.PORT,
    prodcutsMicroserviceHost: envVars.PRODUCTS_MICROSERVICE_HOST,
    prodcutsMicroservicePort: envVars.PRODUCTS_MICROSERVICE_PORT,
    
}
