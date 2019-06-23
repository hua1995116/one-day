import axios from 'axios';

const genuuid = () => ((+new Date() + (Math.random() * 100)).toString(16).replace('.', '-'));

export function getLinkTitle(url) {
  return axios.get(url)
    .then(res => res.data)
    .then((res) => {
      console.log(res);
      return res;
    });
}

export default genuuid;
