import Axios from './axios';

const Service = {
  // 获取title
  getTitle: data => Axios.get('/link/title', {
    params: data,
  }),
};

export default Service;
