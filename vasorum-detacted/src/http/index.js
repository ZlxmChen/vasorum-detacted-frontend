import axios from 'axios';
import router from '@/router';
// <script>
//import { post, get, delet } from '@/http'
const defaultError = (msg, status) => {
  if (status == 401) {
    localStorage.removeItem('token');
    router.push('/login');
  }
  //toast.error('请求失败', '错误信息' + msg);
};

async function post(url, data, success, error = defaultError) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: localStorage.getItem('Authorization'),
      },
    });
    console.log('post');
    console.log(response);
    if (response.status == 200) success(response.data);
    else error(response.data, response.status);
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data.message, axiosError.response.status);
    } else {
      error(axiosError.message);
    }
  }
}
async function postN(url, data, success, error = defaultError) {
  try {
    const response = await axios.post(url, data, {
      headers: {},
    });
    console.log('post');
    console.log(response);
    if (response.status == 200) success(response.data);
    else error(response.data, response.status);
  } catch (axiosError) {
    if (axiosError.response) {
      error(axiosError.response.data.message, axiosError.response.status);
    } else {
      error(axiosError.message);
    }
  }
}
function get(url, params, success, error = defaultError) {
  return axios
    .get(url, {
      params: params,
      headers: {
        Authorization: localStorage.getItem('Authorization'),
      },
    })
    .then((response) => {
      console.log(response.status);
      if (response.status == 200) {
        console.log(response.data);
        success(response.data, response.status);
      } else error(response.data, response.status);
    })
    .catch((axiosError) => {
      if (axiosError.response) {
        error(axiosError.response.data.message, axiosError.response.status);
      } else {
        error(axiosError.message);
      }
    });
}

function delet(url, data, success, error = defaultError) {
  return axios
    .delete(url, {
      headers: {
        token: localStorage.getItem('Authorization'),
      },
      data: data,
    })
    .then(({ data }) => {
      if (data.success) success(data.message, data.status);
      else error(data.message, data.status);
    })
    .catch((axiosError) => {
      if (axiosError.response) {
        error(axiosError.response.data.message, axiosError.response.status);
      } else {
        error(axiosError.message);
      }
    });
}
export { get, post, postN, delet };
