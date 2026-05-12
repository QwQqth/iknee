// 小鹅(iKnee) - 统一网络请求封装
// 支持云函数和普通HTTP请求

const config = require('../constants/config');

/**
 * 统一请求方法
 */
const request = (options = {}) => {
  return new Promise((resolve, reject) => {
    const {
      url = '',
      method = 'GET',
      data = {},
      name,
      header = {},
      showLoading = true,
      loadingText = '加载中...'
    } = options;

    if (showLoading) {
      wx.showLoading({ title: loadingText, mask: true });
    }

    const token = wx.getStorageSync('token');
    const requestHeader = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...header
    };

    if (name) {
      wx.cloud.callFunction({
        name: `${config.api.cloudPrefix}_${name}`,
        data: { url, method, data },
        header: requestHeader,
        success: res => {
          wx.hideLoading();
          handleResult(res, resolve, reject);
        },
        fail: err => {
          wx.hideLoading();
          handleError(err, reject);
        }
      });
    } else {
      wx.request({
        url: `${config.api.baseUrl}${url}`,
        method,
        data,
        header: requestHeader,
        timeout: config.api.timeout,
        success: res => {
          wx.hideLoading();
          handleResult(res, resolve, reject);
        },
        fail: err => {
          wx.hideLoading();
          handleError(err, reject);
        }
      });
    }
  });
};

const get = (url, data, options = {}) => request({ url, method: 'GET', data, ...options });
const post = (url, data, options = {}) => request({ url, method: 'POST', data, ...options });
const put = (url, data, options = {}) => request({ url, method: 'PUT', data, ...options });
const del = (url, data, options = {}) => request({ url, method: 'DELETE', data, ...options });

const handleResult = (res, resolve, reject) => {
  if (res.errMsg && res.errMsg.includes('cloud.callFunction')) {
    if (res.result) {
      const result = res.result;
      if (result.success !== false) {
        resolve(result.data || result);
      } else {
        reject({ code: result.code || -1, message: result.message || '请求失败' });
      }
    } else {
      reject({ code: -1, message: '请求无响应' });
    }
    return;
  }
  if (res.statusCode >= 200 && res.statusCode < 300) {
    const data = res.data;
    if (data.success !== false) {
      resolve(data.data || data);
    } else {
      reject({ code: data.code || res.statusCode, message: data.message || '请求失败' });
    }
  } else if (res.statusCode === 401) {
    reject({ code: 401, message: '登录已过期' });
    wx.reLaunch({ url: '/pages/guide/guide' });
  } else {
    reject({ code: res.statusCode, message: res.data?.message || '请求失败' });
  }
};

const handleError = (err, reject) => {
  wx.showToast({ title: '网络错误', icon: 'none' });
  reject({ code: -1, message: '网络错误' });
};

const uploadFile = (filePath, formData = {}) => {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '上传中...' });
    wx.cloud.uploadFile({
      cloudPath: formData.path || `uploads/${Date.now()}.${filePath.split('.').pop()}`,
      filePath,
      success: res => resolve({ fileID: res.fileID }),
      fail: err => { wx.hideLoading(); reject(err); }
    });
  });
};

module.exports = { request, get, post, put, del, uploadFile };
