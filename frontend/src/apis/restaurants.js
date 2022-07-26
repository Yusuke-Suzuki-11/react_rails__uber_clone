import axios from 'axios';
import { restaurantsIndex } from '../urls';

export const fetchRestaurants = () => {
    return axios.get(restaurantsIndex).then(
        response => {
            return response.data;
        }
    ).catch((e) => console.error(e));
}