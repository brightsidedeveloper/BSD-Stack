import { get } from '../utils/request';
class Get {
    static async healthCheck() {
        return get('/api/health');
    }
}
class Bright {
}
Bright.get = Get;
export default Bright;
