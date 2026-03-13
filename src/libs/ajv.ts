import Ajv, {type JSONSchemaType, ValidateFunction} from "ajv";
import addFormats from 'ajv-formats';

const ajv = new Ajv();

// email, date 형식 사용 가능
addFormats(ajv);

export {ajv, type JSONSchemaType, type ValidateFunction};
export default ajv;
